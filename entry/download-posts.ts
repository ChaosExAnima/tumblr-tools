import fs from 'fs/promises';
import minimist from 'minimist';
import path from 'path';

import type { BlogPostsResponse, Post } from '../lib/types';

import { debug } from '../lib/logging';
import { postPath } from '../lib/posts';
import {
	BLOG_POSTS_LIMIT,
	Client,
	throttle,
	tumblrClient,
} from '../lib/tumblr';

async function saveToFile(post: Post) {
	const fileName = postPath(post);
	try {
		await fs.access(fileName);
		debug('Post already saved:', fileName);
		return;
		// eslint-disable-next-line no-empty
	} catch (err) {}
	try {
		debug('Saving post to:', fileName);
		await fs.mkdir(path.dirname(fileName), { recursive: true });
		await fs.writeFile(fileName, JSON.stringify(post, null, '\t'));
	} catch (err) {
		console.error('Error saving post:', fileName, err);
	}
}

async function fetchPosts(client: Client, blogName: string, offset: number) {
	debug('Requesting tags with offset:', offset * BLOG_POSTS_LIMIT);
	const response = (await client.blogPosts(blogName, {
		offset: offset * BLOG_POSTS_LIMIT,
	})) as BlogPostsResponse;
	await Promise.all(response.posts.map(saveToFile));
}

async function main() {
	const args = minimist(process.argv.slice(2));
	const client = tumblrClient();
	const blogName = args._[0];
	const info = await client.blogInfo(blogName);
	const requestCount = Math.ceil(info.blog.total_posts / BLOG_POSTS_LIMIT);
	debug('Request count:', requestCount);
	const limit = throttle();
	// await fetchPosts(client, blogName, 0);
	await Promise.all(
		[...Array(requestCount).keys()].map((index) =>
			limit(() => fetchPosts(client, blogName, index)),
		),
	);
}

main();

#!/usr/bin/env -S pnpm tsx

import fs from 'fs/promises';
import path from 'path';

import type { BlogPostsResponse, Post } from '../lib/types';

import { blogNameFromArgs } from '../lib/helpers';
import { debug } from '../lib/logging';
import { loadPosts, postPath } from '../lib/posts';
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
	debug('Requesting posts with offset:', offset * BLOG_POSTS_LIMIT);
	const response = (await client.blogPosts(blogName, {
		offset: offset * BLOG_POSTS_LIMIT,
	})) as BlogPostsResponse;
	return response.posts;
}

const limit = throttle();

async function* postGenerator(
	client: Client,
	blogName: string,
	latestTimestamp: number,
) {
	let foundLatest = false;
	let pageNumber = 0;
	do {
		const posts = await limit(() =>
			fetchPosts(client, blogName, pageNumber),
		);
		debug(
			'Fetched batch of',
			posts.length,
			'posts with offset:',
			pageNumber,
		);
		for (const post of posts) {
			if (post.timestamp <= latestTimestamp) {
				foundLatest = true;
				break;
			}
			yield post;
		}
		pageNumber++;
	} while (!foundLatest);
}

async function main() {
	const blogName = blogNameFromArgs();
	const client = tumblrClient();
	const currentPosts = await loadPosts(blogName);
	const latestTimestamp = currentPosts.reduce(
		(max, post) => Math.max(max, post.timestamp),
		0,
	);
	let downloadedPosts = 0;
	for await (const post of postGenerator(client, blogName, latestTimestamp)) {
		await saveToFile(post);
		downloadedPosts++;
	}
	if (downloadedPosts > 0) {
		console.log('Done! Downloaded', downloadedPosts, 'posts');
	} else {
		console.log('No new posts found!');
	}
}

main();

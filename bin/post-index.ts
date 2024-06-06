#!/usr/bin/env -S pnpm tsx

import { blogNameFromArgs, chunk } from '../lib/helpers';
import { loadPosts, postImagePaths } from '../lib/posts';
import { searchClient } from '../lib/search';

async function main() {
	const client = searchClient();
	const blogName = blogNameFromArgs();
	const posts = await loadPosts(blogName);
	const chunks = chunk(posts, 100);
	const tasks = await Promise.all(
		chunks.map(async (posts) => {
			const postsWithImages = await Promise.all(
				posts.map(async (post) => {
					const images = await postImagePaths(post);
					return { ...post, images };
				}),
			);
			return client
				.index('tumblr')
				.addDocuments(postsWithImages, { primaryKey: 'id' });
		}),
	);
	console.log('Indexed', tasks.length, 'posts');
}

main();

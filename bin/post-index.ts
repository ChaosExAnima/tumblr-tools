#!/usr/bin/env -S pnpm tsx

import type { IndexedPost } from '../lib/types';

import { blogNameFromArgs, chunk } from '../lib/helpers';
import { loadPosts, postImagePaths } from '../lib/posts';
import { searchClient } from '../lib/search';

async function main() {
	const index = searchClient();
	const blogName = blogNameFromArgs();
	const posts = await loadPosts(blogName);
	const chunks = chunk(posts, 100);
	await Promise.all(
		chunks.map(async (posts) => {
			const postsWithImages = await Promise.all(
				posts.map(async (post): Promise<IndexedPost> => {
					const images = await postImagePaths(post);
					return {
						...post,
						images,
						is_reblog: !!post.parent_post_url,
					};
				}),
			);
			return index.addDocuments(postsWithImages, {
				primaryKey: 'id',
			});
		}),
	);
	console.log('Indexed', posts.length, 'posts');
}

main();

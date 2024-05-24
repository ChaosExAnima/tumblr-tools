import { readFile } from 'fs/promises';
import { glob } from 'glob';
import path from 'path';

import type { Post } from './types';

import { POSTS_FOLDER } from './constants';

export async function loadPosts(): Promise<Post[]> {
	const files = await glob(`${POSTS_FOLDER}/**/*.json`);
	return Promise.all(
		files.map((file) =>
			readFile(file, 'utf8').then((file) => JSON.parse(file)),
		),
	);
}

export function postPath(post: Post, withJson = true) {
	return path.join(
		POSTS_FOLDER,
		post.blog_name,
		String(new Date(post.timestamp * 1000).getFullYear()),
		String(new Date(post.timestamp * 1000).getMonth() + 1).padStart(2, '0'),
		`${post.id}${withJson ? '.json' : ''}`,
	);
}

export async function postImagePaths(post: Post): Promise<string[]> {
	const path = postPath(post, false);
	return glob(`${path}/*`);
}

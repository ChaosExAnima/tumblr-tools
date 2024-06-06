#!/usr/bin/env -S pnpm tsx
import type { Post } from '../lib/types';

import { searchClient } from '../lib/search';

type PostKeys = keyof Post;

async function main() {
	const client = searchClient();
	const index = client.index<Post>('tumblr');
	await Promise.allSettled([
		index.updateFaceting({
			sortFacetValuesBy: {
				tags: 'count',
			},
		}),
		index.updateFilterableAttributes([
			'state',
			'tags',
			'type',
			'timestamp',
		] as PostKeys[]),
		index.updateDisplayedAttributes([
			'body',
			'caption',
			'id',
			'images',
			'note_count',
			'parent_post_url',
			'post_url',
			'state',
			'summary',
			'tags',
			'timestamp',
			'title',
			'trail',
			'type',
		] as PostKeys[]),
	]);
	console.log('Updated index settings');
}

main();

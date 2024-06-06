#!/usr/bin/env -S pnpm tsx
import type { IndexedPost } from '../lib/types';

import { searchClient } from '../lib/search';

type PostKeys = keyof IndexedPost;

async function main() {
	const index = searchClient();
	await Promise.allSettled([
		index.updateFaceting({
			sortFacetValuesBy: {
				tags: 'count',
			},
		}),
		index.updateFilterableAttributes([
			'is_reblog',
			'state',
			'tags',
			'type',
			'timestamp',
		] as PostKeys[]),
		index.updateSortableAttributes([
			'note_count',
			'state',
			'tags',
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

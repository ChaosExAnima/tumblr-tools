#!/usr/bin/env -S pnpm tsx
import type { IndexedPost } from '../lib/types';

import { searchClient } from '../lib/search';

type PostKeys = keyof IndexedPost;

async function main() {
	const index = searchClient();
	const results = await Promise.allSettled([
		index.updateFaceting({
			sortFacetValuesBy: {
				tags: 'count',
			},
		}),
		index.updateRankingRules([
			'words',
			'typo',
			'sort',
			'proximity',
			'attribute',
			'exactness',
		]),
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
	const failed = results.filter((result) => result.status === 'rejected');
	if (failed.length > 0) {
		console.error('Some updates failed:', failed);
	}
	console.log('Updated index settings!');
}

main();

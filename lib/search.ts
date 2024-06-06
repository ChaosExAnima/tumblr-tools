import 'dotenv/config';
import MeiliSearch from 'meilisearch';

import type { IndexedPost } from './types';

export function searchClient() {
	const host = process.env.MEILISEARCH_HOST ?? 'http://localhost:7700';
	const apiKey = process.env.MEILISEARCH_KEY;
	if (!apiKey) {
		throw new Error('MEILISEARCH_KEY is required');
	}
	const client = new MeiliSearch({
		apiKey,
		host,
	});
	return client.index<IndexedPost>('tumblr');
}

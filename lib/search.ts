import 'dotenv/config';
import MeiliSearch from 'meilisearch';

export function searchClient() {
	const host = process.env.MEILISEARCH_HOST ?? 'http://localhost:7700';
	const apiKey = process.env.MEILISEARCH_KEY;
	if (!apiKey) {
		throw new Error('MEILISEARCH_KEY is required');
	}
	return new MeiliSearch({
		apiKey,
		host,
	});
}

import 'dotenv/config';
import MeiliSearch from 'meilisearch';
import minimist from 'minimist';

import { Post } from '../lib/types';

async function main() {
	const args = minimist(process.argv.slice(2));
	const client = new MeiliSearch({
		apiKey: process.env.MEILISEARCH_KEY,
		host: 'http://localhost:7700',
	});

	if (args._.length === 0) {
		console.error('Usage: search [--page N] [--no-facets] <query>');
		process.exit(1);
	}

	const query = args._.join(' ');
	const page = args.page ? parseInt(args.page, 10) : 1;
	const noFacets = args.facets === false;
	const response = await client
		.index('tumblr')
		.search<Post>(query, { facets: ['tags', 'type'], page });
	const hitCount =
		response.totalHits ??
		`~${response.estimatedTotalHits}` ??
		response.hits.length;
	console.log(
		`Got ${hitCount} results for ${query} in ${response.processingTimeMs}ms:`,
	);
	const indexOffset = (page - 1) * response.hitsPerPage;
	console.log(
		response.hits
			.map(
				(hit, index) => `\t${index + 1 + indexOffset}: ${hit.post_url}`,
			)
			.join('\n'),
	);
	if (noFacets) {
		return;
	}
	console.log();
	for (const [facet, values] of Object.entries(response.facetDistribution)) {
		console.log(`${facet}:`);
		for (const [value, count] of Object.entries(values)) {
			console.log(`\t${value}: ${count}`);
		}
	}
}

main();

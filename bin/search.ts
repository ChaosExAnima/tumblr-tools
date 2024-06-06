#!/usr/bin/env -S pnpm tsx

import 'dotenv/config';
import minimist from 'minimist';

import { searchClient } from '../lib/search';

async function main() {
	const args = minimist(process.argv.slice(2));
	if (args._.length === 0) {
		console.error(
			'Usage: search [--page N] [--facets] [--filter <filters>] [--sort <sorting>] <query>',
		);
		process.exit(1);
	}

	const facets = args.facets === true;
	const filter = args.filter;
	const page = args.page ? parseInt(args.page, 10) : 1;
	const query = args._.join(' ');
	const sort = args.sort ? String(args.sort).split(',') : [];

	const index = searchClient();
	const response = await index.search(query, {
		page,
		...(filter && { filter }),
		...(sort.length > 0 && { sort }),
		...(facets && { facets: ['tags', 'type'] }),
	});

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
	if (facets) {
		console.log();
		for (const [facet, values] of Object.entries(
			response.facetDistribution,
		)) {
			console.log(`${facet}:`);
			for (const [value, count] of Object.entries(values)) {
				console.log(`\t${value}: ${count}`);
			}
		}
	}
}

main();

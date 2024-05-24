import 'dotenv/config';
import MeiliSearch from 'meilisearch';
import minimist from 'minimist';

async function main() {
	const args = minimist(process.argv.slice(2));
	const client = new MeiliSearch({
		apiKey: process.env.MEILISEARCH_KEY,
		host: 'http://localhost:7700',
	});

	if (args._.length === 0) {
		console.error('Usage: search <query>');
		process.exit(1);
	}

	const query = args._.join(' ');
	console.log('Searching for:', query);
	const response = await client.index('tumblr').search(query);
	console.log(response);
}

main();

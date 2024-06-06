import minimist from 'minimist';

export function chunk<Type>(
	arr: Type[],
	chunkSize = 1,
	cache: Type[][] = [],
): Type[][] {
	const tmp = [...arr];
	if (chunkSize <= 0) return cache;
	while (tmp.length) {
		cache.push(tmp.splice(0, chunkSize));
	}
	return cache;
}

export function blogNameFromArgs(): string {
	const args = minimist(process.argv.slice(2));
	if (args._.length === 0) {
		throw new Error('Blog name is not set');
	}
	return args._[0];
}

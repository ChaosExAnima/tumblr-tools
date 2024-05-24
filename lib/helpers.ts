export function chunk<Type extends any>(
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

async function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

import colors from 'colors/safe';
import minimist from 'minimist';

export function isVerbose() {
	const args = minimist(process.argv.slice(2));
	return !!(args.verbose || args.v);
}

export function debug(...args: unknown[]) {
	if (isVerbose()) {
		const string = args
			.map((arg) =>
				typeof arg === 'string' ? arg : JSON.stringify(arg, null, 2),
			)
			.join(' ');
		console.log(colors.dim(string));
	}
}

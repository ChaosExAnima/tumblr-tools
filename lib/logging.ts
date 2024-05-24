import colors from 'colors/safe';
import minimist from 'minimist';

export function isVerbose() {
	const args = minimist(process.argv.slice(2));
	return !!args.verbose;
}

export function debug(...args: unknown[]) {
	if (isVerbose()) {
		const string = args
			.map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
			.join(' ');
		console.log(colors.dim(string));
	}
}

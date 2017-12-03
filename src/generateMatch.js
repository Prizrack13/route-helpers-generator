import pathToRegexp from 'path-to-regexp'

const generateMatch = (path) => {
	let keys = [];
	const regexp = pathToRegexp(path, keys);
	return (url) => {
		const match = regexp.exec(url);
		if (!match) {
			return null;
		}
		const [, ...values] = match;
		return keys.reduce((memo, key, index) => {
			memo[key.name] = values[index];
			return memo;
		}, {});
	};
};

export default generateMatch;

import qs from 'qs'
import {pathToRegexp} from 'path-to-regexp'
const URL = typeof window === 'undefined' || window.URL.parse === undefined ? require('url') : window.URL

const generateMatch = (path) => {
	let keys = [];
	const regexp = pathToRegexp(path, keys);
	return (url) => {
		url = URL.parse(url);
		const formatMatch = url.pathname.match(/\.([^.]+)$/);
		const format = formatMatch && formatMatch[1];
		const match = regexp.exec(url.pathname.replace(/\.[^.]+$/, ''));
		if (!match) {
			return null;
		}
		const [, ...values] = match;
		let params = keys.reduce((memo, key, index) => {
			memo[key.name] = values[index];
			return memo;
		}, {});
		url.hash && (params.hash = url.hash.replace(/^#/, ''));
		url.query && (params = {...params, ...qs.parse(url.query)});
		format && (params.format = format);
		return params;
	};
};

export default generateMatch;

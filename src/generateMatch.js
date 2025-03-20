import qs from 'qs'
import {pathToRegexp} from 'path-to-regexp'

const parseURL = (url) => {
	if (typeof(url) === 'object') return url;
	if (!url.match(/^http/)) url = 'https://test.com' + url
	const regex = /^(https?):\/\/([^:/]+)(:\d+)?(\/[^?#]*)?(\?[^#]*)?(#.*)?$/;
	const match = url.match(regex);
	if (match) {
		const [, protocol, hostname, port, pathname, search, hash] = match;
		return { protocol, hostname, port, pathname, search, hash };
	}
	return null
};
const generateMatch = (path) => {
	let keys = [];
	const regexp = pathToRegexp(path, keys);
	return (url) => {
		url = parseURL(url);
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
		url.search && (params = {...params, ...qs.parse(url.search.replace(/^\?/, ''))});
		format && (params.format = format);
		return params;
	};
};

export default generateMatch;

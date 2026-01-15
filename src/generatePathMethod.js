import qs from 'qs'
import {parse, tokensToFunction} from 'path-to-regexp'

const bigintToString = (value) => {
	// eslint-disable-next-line valid-typeof
	if (typeof value === 'bigint') return value.toString();
	if (Array.isArray(value)) return value.map(bigintToString);
	if (value === null || value instanceof Date) return value;
	if (typeof value === 'object') {
		return Object.entries(value).reduce((acc, [key, value]) => {
			acc[key] = bigintToString(value);
			return acc;
		}, {});
	}
	return value;
}

const generatePathMethod = (path) => {
	const tokens = parse(path);
	const tokenNames = tokens.map((token) => typeof token === 'string' ? null : token.name).filter((token) => token);
	const pathFunc = tokensToFunction(tokens);
	return [tokenNames, (data, options) => {
		let queryValues = {};
		Object.keys(data || {}).forEach((key) => {
			tokenNames.findIndex((tokenName) => tokenName === key) === -1 &&
			key !== 'hash' &&
			key !== 'format' &&
			(queryValues[key] = data[key]);
		});
		const path = pathFunc(bigintToString(data || {}), options);
		const query = qs.stringify(queryValues, Object.assign({ arrayFormat: 'brackets' }, options || {}));
		const hash = (data || {}).hash || '';
		const format = (data || {}).format || '';
		return `${path}${format && `.${format}`}${query && '?'}${query}${hash && '#'}${hash}`;
	}];
};

export default generatePathMethod;

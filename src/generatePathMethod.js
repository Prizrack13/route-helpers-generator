import qs from 'qs'
import {parse, tokensToFunction} from 'path-to-regexp'

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
		const path = pathFunc(data, options);
		const query = qs.stringify(queryValues, { arrayFormat: 'brackets' });
		const hash = (data || {}).hash || '';
		const format = (data || {}).format || '';
		return `${path}${format && `.${format}`}${query && '?'}${query}${hash && '#'}${hash}`;
	}];
};

export default generatePathMethod;

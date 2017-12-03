import generatePathMethod from './generatePathMethod'

const generateUrlMethod = (host, path) => {
	let tokenNames;
	let method;
	if (typeof path === 'function') {
		method = path;
	} else {
		[tokenNames, method] = generatePathMethod(path);
	}
	const func = (data, options) => {
		return [typeof host === 'function' ? host() : host, method(data, options)].filter(n => n).join('');
	};
	return typeof path === 'function' ? func : [tokenNames, func];
};

export default generateUrlMethod;

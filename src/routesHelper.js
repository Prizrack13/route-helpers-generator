import generateMatch from './generateMatch'
import generatePathMethod from './generatePathMethod'
import generateUrlMethod from './generateUrlMethod'

class RoutesHelper {
	constructor(routes, options = {}) {
		this.config = {host: options.host};
		this.routes = [];
		Object.keys(routes).forEach((key) => {
			this.routes.push(key);
			this[`${key}Regexp`] = (options = {}) => options.noslash ? routes[key].replace(/^\//, '') : routes[key];
			this[`${key}Match`] = generateMatch(routes[key]);
			[this[`${key}Tokens`], this[`${key}Path`]] = generatePathMethod(routes[key]);
			this[`${key}Url`] = generateUrlMethod(this.getHost.bind(this), this[`${key}Path`]);
			(options.customMethods || []).forEach((method) => method(this));
		});
	}

	setHost(host) {
		this.config.host = host;
	}

	getHost() {
		return this.config.host;
	}

	match(url) {
		let result = null;
		for (let key of this.routes) {
			result = this[`${key}Match`](url);
			if (result !== null) {
				return {name: key, params: result};
			}
		}
		return null;
	}
}

export default RoutesHelper;

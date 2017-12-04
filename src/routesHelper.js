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

	show(method = console.log) {
		const Table = require('cli-table');
		let table = new Table({
			chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': '',
				'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': '',
				'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': '',
				'right': '' , 'right-mid': '' , 'middle': ' '
			},
			style: { 'padding-left': 0, 'padding-right': 0 },
			head: ['Method', 'Result']
		});
		this.routes.forEach((key) => {
			const params = this[`${key}Tokens`].reduce((memo, name, index) => {
				memo[name] = index + 1;
				return memo;
			}, {});
			const path = this[`${key}Path`](params);
			table.push(
				[`${key}Regexp()`, `${this[`${key}Regexp`]()}`],
				[`${key}Match('${path}')`, `${JSON.stringify(this[`${key}Match`](path))}`],
				[`${key}Tokens`, `${JSON.stringify(this[`${key}Tokens`])}`],
				[`${key}Path(${JSON.stringify(params)})`, path],
				[`${key}Url(${JSON.stringify(params)})`, `${this[`${key}Url`](params)}`]
			);
		});
		method(table.toString());
	}
}

export default RoutesHelper;

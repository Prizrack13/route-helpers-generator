import RoutesHelper, {generatePathMethod, generateUrlMethod, generateMatch} from '../src'

const userRegexp = '/users/:id';
const usersRegexp = '/users';
const host = 'http://test.com';
const host2 = 'https://test.com';

test('generatePathMethod', () => {
	const method = generateMatch(userRegexp);
	expect(method('/users/1')).toEqual({id: '1'});
	expect(method('/users/2')).toEqual({id: '2'});
	expect(method('/users')).toEqual(null);
	expect(method('/users/2.json')).toEqual({id: '2', format: 'json'});
	expect(method('/users/2#test')).toEqual({id: '2', hash: 'test'});
	expect(method('/users/2?q=search')).toEqual({id: '2', q: 'search'});
	expect(method('/users/2?q%5B%5D=1&q%5B%5D=2')).toEqual({id: '2', q: ['1', '2']});
	expect(method('/users/2?q%5Bname%5D=john')).toEqual({id: '2', q: {name: 'john'}});
});

test('generatePathMethod', () => {
	const [tokenNames, method] = generatePathMethod(userRegexp);
	expect(tokenNames).toEqual(['id']);
	expect(typeof method).toBe('function');
	expect(() => method({})).toThrow(/Expected "id"/);
	expect(method({id: 1})).toBe('/users/1');
	expect(method({id: 1, format: 'json'})).toBe('/users/1.json');
	expect(method({id: 1, hash: 'test'})).toBe('/users/1#test');
	expect(method({id: 1, q: 'search'})).toBe('/users/1?q=search');
	expect(method({id: 1, q: [1, 2]})).toBe('/users/1?q%5B%5D=1&q%5B%5D=2');
	expect(method({id: 1, q: {name: 'john'}})).toBe('/users/1?q%5Bname%5D=john');
});

test('generateUrlMethod', () => {
	let [tokenNames, method] = generateUrlMethod(host, userRegexp);
	expect(tokenNames).toEqual(['id']);
	expect(typeof method).toBe('function');
	expect(() => method({})).toThrow(/Expected "id"/);
	expect(method({id: 1})).toBe(`${host}/users/1`);
	const config = {host};
	[tokenNames, method] = generateUrlMethod(() => config.host, userRegexp);
	expect(method({id: 1})).toBe(`${host}/users/1`);
	config.host = host2;
	expect(method({id: 1})).toBe(`${host2}/users/1`);
});

test('RoutesHelper', () => {
	const routesHelper = new RoutesHelper({user: userRegexp, users: usersRegexp});
	expect(typeof routesHelper.userPath).toBe('function');
	expect(typeof routesHelper.userUrl).toBe('function');
	expect(typeof routesHelper.userRegexp).toBe('function');
	expect(routesHelper.userRegexp()).toBe(userRegexp);
	expect(routesHelper.userRegexp({noslash: true})).toBe(userRegexp.replace(/^\//, ''));
	expect(routesHelper.userPath({id: 1})).toBe('/users/1');
	expect(routesHelper.userUrl({id: 1})).toBe('/users/1');
	routesHelper.setHost(host);
	expect(routesHelper.userUrl({id: 1})).toBe(`${host}/users/1`);
	expect(routesHelper.match('/users/1')).toEqual({name: 'user', params: {id: '1'}});
	expect(routesHelper.match('/users')).toEqual({name: 'users', params: {}});
	expect(routesHelper.match('/')).toEqual(null);
});

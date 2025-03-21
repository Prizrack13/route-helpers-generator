# Route helpers generator

Create methods to easily generate paths and url

[![npm version](https://img.shields.io/npm/v/route-helpers-generator.svg?style=flat-square)](https://www.npmjs.com/package/route-helpers-generator)

## Dependencies

* path-to-regexp - ^2.1.0
* qs - ^6.5.1
* cli-table - ^0.3.1
* randexp - ^0.5.3

## Install

```
npm install --save route-helpers-generator
or
yarn add route-helpers-generator
```

_Note: it is assumed that this will be used in a modern environment, for legacy environments add [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) in your app._

## Usage

Declare some routes:


```js
import RoutesHelper, {generatePathMethod, generateUrlMethod, generateMatch} from 'route-helpers-generator'

const userMatch = generateMatch('/users/:id');
userMatch('/users/1') // => {id: 1}
userMatch('/users') // => null

const userPath = generatePathMethod('/users/:id');
userPath({id: 1}) // => '/users/1'
userPath({id: 1, format: 'json'}) // => '/users/1.json'
userPath({id: 1, hash: 'test'}) // => '/users/1#test'
userPath({id: 1, name: 'john'}) // => '/users/1?name=john'
userPath({id: 1, user: {name: 'john'}}) // => '/users/1?user%5Bname%5D=john'
userPath({id: 1, user: [1, 2]}) // => '/users/1?user%5B%5D=1&user%5B%5D=2'

const userUrl = generateUrlMethod('http://test.com', '/users/:id');
userUrl({id: 1}) // => 'http://test.com/users/1'

const routesHelper = new RoutesHelper({user: '/users/:id', users: '/users'}, {host: 'http://test.com'})
routesHelper.userPath({id: 1}) // => '/users/1'
routesHelper.userUrl({id: 1}) // => 'http://test.com/users/1'
routesHelper.userRegexp({}) // => '/users/:id'
routesHelper.userRegexp({noslash: true}) // => 'users/:id'
routesHelper.userRegexp({noslash: true}) // => 'users/:id'
routesHelper.setHost('https://test.com')
routesHelper.userUrl({id: 1}) // => 'https://test.com/users/1'
routesHelper.match('/users/1') // => {name: 'user', params: {id: '1'}}
routesHelper.match('/users') // => {name: 'users', params: {}}
routesHelper.match('/') // => null
```

## Help Script

Add to package.json to show generated methods

_You will need to add babel and babel-cli and use babel-node in case you use presets._

./routesHelper
```js
import RoutesHelper from 'route-helpers-generator'
const routesHelper = new RoutesHelper({user: '/users/:id', users: '/users'}, {host: 'http://test.com'})

export default routesHelper;
````

```json
{
    "scripts": {
        "routes": "babel-node -e \"require('./routesHelper').default.help()\""
    }
}
```

## Release

`npm publish`
`npm unpublish route-helpers-generator@version`

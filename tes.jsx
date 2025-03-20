import RoutesHelper from './src/'

const states = '(district-of-columbia|alabama|alaska|arizona|arkansas|california|colorado|connecticut|delaware|florida|georgia|hawaii|idaho|illinois|indiana|iowa|kansas|kentucky|louisiana|maine|maryland|massachusetts|michigan|minnesota|mississippi|missouri|montana|nebraska|nevada|new-hampshire|new-jersey|new-mexico|new-york|north-carolina|north-dakota|ohio|oklahoma|oregon|pennsylvania|rhode-island|south-carolina|south-dakota|tennessee|texas|utah|vermont|virginia|washington|west-virginia|wisconsin|wyoming)';
const state = `:state${states}?`;
const page = ':page(\\d+)?';
const routes = {
	// best: `/best-:section?:section_suffix(-)?colleges/${state}/${page}`,
	best: `/best-:section/${state}/${page}`,
	test: '/test'
};

const routesHelper = new RoutesHelper(routes);

// console.log(1, routesHelper.bestMatch('/best-colleges'));
// console.log(2, routesHelper.bestMatch('/best-colleges/iowa'));
// console.log(3, routesHelper.bestMatch('/best-colleges/iowa/1'));
// console.log(4, routesHelper.bestMatch('/best-colleges/1'));
// console.log(5, routesHelper.bestPath({}));
// console.log(6, routesHelper.bestPath({state: 'iowa'}));
// console.log(7, routesHelper.bestPath({state: 'iowa', page: 1}));
// console.log(8, routesHelper.bestPath({page: 1}));
// console.log(9, routesHelper.bestPath({state: 'iowa', page: null}));
// console.log(10, routesHelper.bestMatch('/best-private-colleges/iowa/1'));
// console.log(11, routesHelper.bestPath({section: 'private', state: 'iowa', page: 1}));
console.log(routesHelper.testPath({a: ['1', '2', '3']}))
console.log(routesHelper.testPath({a: ['1', '2', '3']}, {arrayFormat: 'repeat'}))

routesHelper.help()

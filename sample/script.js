import evaSwitch from '../src/index.js';

evaSwitch('hello world')
	.default((value) => {
		console.log(value);
	});

evaSwitch('hello world')
	.case(/hollo/, 0)
	.do((value, match, id) => {
		console.log(value, match, id);
	})
	.case(/hello/, 1)
	.case(/hell(o)/, 2)
	.do((value, match, id) => {
		console.log(value, match, id);
	})
	.default((value) => {
		console.log(value);
	});

evaSwitch('hello world')
	.case((value) => {
		return value + ' abc';
	}, 3)
	.do((value, match, id) => {
		console.log(value, match, id);
	})
	.default((value) => {
		console.log(value);
	});

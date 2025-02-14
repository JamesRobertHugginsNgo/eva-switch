import evaSwitch from '../src/index.js';

function insertAdjacentHTML(...args) {
	document.body.insertAdjacentHTML('beforeend', `<p>${JSON.stringify(args)}</p>`);
}

evaSwitch('hello world')
	.default((value) => {
		insertAdjacentHTML(value);
	});

evaSwitch('hello world')
	.case(/hollo/, 'case0')
	.do((value, match, id) => {
		insertAdjacentHTML(value, match, id);
	})
	.case(/hell(o)/, 'case1')
	.case(/hello/, 'case2')
	.do((value, match, id) => {
		insertAdjacentHTML(value, match, id);
	})
	.default((value) => {
		insertAdjacentHTML(value);
	});

evaSwitch('hello world')
	.case((value) => {
		return value + ' abc';
	}, 'case3')
	.do((value, result, id) => {
		insertAdjacentHTML(value, result, id);
	})
	.default((value) => {
		insertAdjacentHTML(value);
	});

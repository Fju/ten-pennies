const rollup = require('rollup');

rollup.rollup({
	input: 'src/main.js'
}).then((bundle) => {
	return bundle.write({
		format: 'cjs',
		file: './bundle.js',
		indent: false
	});
}).catch(errorHandler).then(() => {
	console.log('Success');
});

function errorHandler(err) {
	console.error(err);
}

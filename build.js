const rollup = require('rollup');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');

rollup.rollup({
	input: 'src/main.js',
	plugins: [
		resolve({
			jsnext: true,
			main: true
		}),
		commonjs({
			include: 'node_modules/**'
		})
	]
}).then((bundle) => {
	return bundle.write({
		format: 'cjs',
		file: './bundle.js',
		exports: 'none',
		indent: false
	});
}).catch(errorHandler).then(() => {
	console.log('Success');
});

function errorHandler(err) {
	console.error(err);
}

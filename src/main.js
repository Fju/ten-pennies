import Darwin from './darwin.js';
import render from './render.js';

const parameters = {
	population_count: 1000,
	crossover_pivot_count: 3,
	mutation_probability: 0.3,
	circle_radius: 0.146,
	circle_count: 10
};

const MAX_ITERATIONS = 25000;

let darwin = new Darwin(parameters);
let error = 1, i = 0;
while (error > 0 && i < MAX_ITERATIONS) {
	let { step, best, avg, progress } = darwin.evolve();

	error = 1 - progress;
	console.log('#' + step + ' Best: ' + best.toFixed(5) + ' (' + (100*progress).toFixed(1) + '%) Average: ' + avg.toFixed(5));

	i++;
}
render(darwin.getBest(), parameters.circle_radius, 'result');




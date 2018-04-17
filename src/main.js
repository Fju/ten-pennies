import Darwin from './darwin.js';

const parameters = {
	population_count: 50,
	crossover_pivot_count: 3,
	mutation_probability: 0.3,
	circle_radius: 0.14,
	circle_count: 10
};


let darwin = new Darwin(parameters);

darwin.init();

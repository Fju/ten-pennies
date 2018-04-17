import Individual from './individual.js';
import * as utils from './utils.js';

export default class Darwin {
	constructor(params) {
		this.population = [];
		
		this.POPULATION_COUNT = params.population_count;
		this.CROSSOVER_PIVOT_COUNT = params.crossover_pivot_count;
		this.MUTATION_PROBABILITY = params.mutation_probability;
		this.CIRCLE_RADIUS = params.circle_radius;
		this.CIRCLE_COUNT = params.circle_count;

		this.step = 0;
	}
	evolve() {
		if (this.population.length === 0) {
			console.log('Population needs to be initialized!');
			this.init();
		}
		
		// evaluate fitness
		let i, j, fitness = 0, gene, x, y;
		let r = this.CIRCLE_RADIUS;
		for (i = 0; i != this.population.length; ++i) {
			fitness = 0;
			for (gene of this.population[i].genes) {
				x = gene.x;
				y = gene.y;
				
				A = Math.PI * r * r;
				
				if (utils.circleInSquare(x, y, r)) fitness += A; 
				else {
					// TODO: calculate how much of the circle is inside the square
				}
				
				// TODO: calculate IOU's of circles	
			}
		}
	
		this.step++;
	}
	selection() {
		
		// sort
		this.population.sort((a, b) => {
			if (a.fitness > b.fitness) return 1;
			else if (a.fitness < b.fitness) return -1;
			return 0;
		});
	}
	init() {
		let i;
		
		this.population = [];
		this.step = 0;
		for (i = 0; i != this.POPULATION_COUNT; ++i) {
			this.population[i] = new Individual(this.CIRCLE_COUNT);
		}		
	}
}

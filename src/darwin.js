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
		let fitness, gene, genes, individual, x, y;
		let r = this.CIRCLE_RADIUS;
		let A = Math.PI * r * r;
		for (individual of this.population) {
			fitness = 0;

			genes = individual.genes;
			for (gene of genes) {
				x = gene.x;
				y = gene.y;				
				
				if (utils.circleInSquare(x, y, r)) fitness++;				
				
			}
			
			let a, b;
			// nested loop for every possible combination of circles (ignoring order)
			// it will iterate circles * (circles - 1) / 2 times -> O(n²)
			for (a = 0; a !== genes.length - 1; ++a) {
				for (b = a + 1; b !== genes.length; ++b) {
					fitness -= utils.iou(genes[a].x, genes[a].y, genes[b].x, genes[b].y, r) 
				}
			}

			// set the fitness of the current individual
			individual.fitness = fitness;
		}

		// sort ascending
		this.population.sort((a, b) => {
			if (a.fitness > b.fitness) return -1;
			else if (a.fitness < b.fitness) return 1;
			return 0;
		});		
		
		let rand, index;

		// selection
		while (this.population.length > this.POPULATION_COUNT / 2) {
			// randomly kill one individual
			// better individuals are more likely to survive
			rand = Math.random();
			this.population.splice(Math.floor((1 - rand * rand * rand) * this.population.length), 1);
		}

		// reproduce
		let parent_range = this.population.length, child, parentA, parentB;
		while (this.population.length < this.POPULATION_COUNT) {
			// randomly pick individuals for reproduction
			rand = Math.random();
			parentA = Math.floor(rand * rand * rand * parent_range);
			parentB = parentA;
			while (parentA === parentB) {
				rand = Math.random();
				parentB = Math.floor(rand * rand * rand * parent_range);
			}
		
			child = new Individual();
			child.crossover(this.population[parentA], this.population[parentB], 3);
			child.mutate(this.MUTATION_PROBABILITY);

			this.population.push(child);			
		}
		this.step++;


		let best = this.population[0].fitness;
		let progress = best / this.CIRCLE_COUNT;	
		
		var sum = this.population.reduce((a, b) => {
			// small hack, first `a` is an object otherwise it's the previous value of the added fitnesses
			if (typeof a === 'object') return a.fitness + b.fitness;
			return a + b.fitness;
		});
		var avg = sum / this.POPULATION_COUNT;

		return {
			step: this.step,
			best: best,
			avg: avg,
			progress: progress
		};
	}
	init() {
		let i;
		
		this.population = [];
		this.step = 0;
		for (i = 0; i != this.POPULATION_COUNT; ++i) {
			this.population[i] = new Individual(this.CIRCLE_COUNT);
		}		
	}
	getBest() {
		return this.population[0].genes;
	}
}

'use strict';

class Gene {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		if (x == undefined) this.x = Math.random();
		if (y == undefined) this.y = Math.random();
	}
	mutate(probability) {
		if (Math.random() < probability) {
			this.x = Math.random();
			this.y = Math.random();
		}	 
	}
	clone() {
		return new Gene(this.x, this.y);
	}
}

function fillAscending(start, end) {
	var array = [], counter = start;
	while (counter < end) {
		array.push(counter++);
	}
	return array;
}

class Individual {
	constructor(length) {
		this.genes = [];
		this.fitness = 0;

		if (length) this.init(length);
	}
	init(length) {
		// clear DNA
		this.genes = [];
		var i;
		for (i = 0; i != length; ++i) {
			this.genes[i] = new Gene();
		}
	}	
	crossover(parentA, parentB, pivotCount) {
		let pivots = fillAscending(1, this.genes.length - 1), i;

		while (pivots.length !== pivotCount) {
			let index = Math.floor(Math.random() * pivots.length);
			pivots.splice(index, 1);
		}
		
		let fromParentA = (Math.random() > 0.5);
		for (i = 0; i !== this.genes.length; ++i) {
			if (i in pivots) fromParentA = !fromParentA; // toggle
			
			this.genes.length[i] = fromParentA ? parentA.genes[i].clone() : parentB.genes[i].clone();
		}
		
		console.log(this.genes);
	}
	mutate(probability) {
		let i;
		for (i = 0; i != this.genes.length; ++i) {
			this.genes[i].mutate(probability);	
		}
	}
}

class Darwin {
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
		
		console.log(this.population);	
	
		this.step++;
	}
	selection() {
		
	}
	init() {
		console.log(this.POPULATION_COUNT);
		let i;
		
		this.population = [];
		this.step = 0;
		for (i = 0; i != this.POPULATION_COUNT; ++i) {
			this.population[i] = new Individual(this.CIRCLE_COUNT);
		}
		console.log(this.population);
	}
}

const parameters = {
	population_count: 50,
	crossover_pivot_count: 3,
	mutation_probability: 0.3,
	circle_radius: 0.14,
	circle_count: 10
};


let darwin = new Darwin(parameters);

darwin.init();

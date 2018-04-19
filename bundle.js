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

function circleInSquare(x, y, r) {
	return (x - r >= 0 &&
		x + r <= 1 &&
		y - r >= 0 &&
		y + r <= 1);
}

function iou(x1, y1, x2, y2, r) {
	// calculate intersection over union of two circle with the same radius `r`
	// x1, x2, y1, y2 represent the coordinates of the two center points of the circles
	let d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

	// circles don't overlap, so IOU is zero.
	if (d >= 2 * r) return 0;

	let intersection = 2 * r * r * Math.acos(d / (2 * r)) - 0.5 * d * Math.sqrt(4 * r * r - d * d);
	let	union = 2 * Math.PI * r * r;

	return intersection / (union - intersection);
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
		let pivots = fillAscending(1, parentA.genes.length - 1), i;

		while (pivots.length !== pivotCount) {
			let index = Math.floor(Math.random() * pivots.length);
			pivots.splice(index, 1);
		}

		let fromParentA = (Math.random() > 0.5);
		for (i = 0; i !== parentA.genes.length; ++i) {
			if (i in pivots) fromParentA = !fromParentA; // toggle
				
			this.genes[i] = fromParentA ? parentA.genes[i].clone() : parentB.genes[i].clone();
		}
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
		let fitness, gene, genes, individual, x, y;
		let r = this.CIRCLE_RADIUS;
		let A = Math.PI * r * r;
		for (individual of this.population) {
			fitness = 0;

			genes = individual.genes;
			for (gene of genes) {
				x = gene.x;
				y = gene.y;				
				
				if (circleInSquare(x, y, r)) fitness++;				
				
			}
			
			let a, b;
			// nested loop for every possible combination of circles (ignoring order)
			// it will iterate circles * (circles - 1) / 2 times -> O(n²)
			for (a = 0; a !== genes.length - 1; ++a) {
				for (b = a + 1; b !== genes.length; ++b) {
					fitness -= iou(genes[a].x, genes[a].y, genes[b].x, genes[b].y, r); 
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
		
		let rand;

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

const fs = require('fs');
const Canvas = require('canvas');

const IMAGE_PADDING = 20;
const IMAGE_SIZE = 400;

function render(values, radius, filename) {
	let canvas = new Canvas(IMAGE_SIZE + 2 * IMAGE_PADDING, IMAGE_SIZE + 2 * IMAGE_PADDING);
	let ctx = canvas.getContext('2d');
 
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'red';
	ctx.fillStyle = 'white';
	ctx.rect(IMAGE_PADDING, IMAGE_PADDING, IMAGE_SIZE, IMAGE_SIZE);
	ctx.stroke();
	ctx.fill();
	ctx.clip();

	ctx.lineWidth = 2;
	ctx.strokeStyle = 'black';
	for (let item of values) {
		console.log(item);
		ctx.beginPath();
		ctx.arc(IMAGE_PADDING + IMAGE_SIZE * item.x, IMAGE_PADDING + IMAGE_SIZE * item.y, radius * IMAGE_SIZE, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();
	}
	

	return new Promise(resolve => {
    	let out = fs.createWriteStream(__dirname + '/' + filename + '.png');
		let stream = canvas.pngStream();
 
		stream.on('data', chunk => {
			out.write(chunk);
		}); 
		stream.on('end', resolve);
	});
}

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

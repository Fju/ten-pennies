import Gene from './gene.js';
import * as utils from './utils.js';

export default class Individual {
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
		let pivots = utils.fillAscending(1, this.genes.length - 1), i;

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



export default class Gene {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		if (x == undefined) this.x = Math.random()
		if (y == undefined) this.y = Math.random()
	}
	mutate(probability) {
		if (Math.random() < probability) {
			this.x = Math.random();
			this.y = Math.random()
		}	 
	}
	clone() {
		return new Gene(this.x, this.y);
	}
}

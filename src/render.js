const fs = require('fs');
const Canvas = require('canvas');

const IMAGE_PADDING = 20;
const IMAGE_SIZE = 400;

export default function render(values, radius, filename) {
	let canvas = new Canvas(IMAGE_SIZE + 2 * IMAGE_PADDING, IMAGE_SIZE + 2 * IMAGE_PADDING);
	let ctx = canvas.getContext('2d');
 
	ctx.lineWidth = 2;
	ctx.strokeStyle = 'red';
	ctx.fillStyle = 'white';
	ctx.rect(IMAGE_PADDING, IMAGE_PADDING, IMAGE_SIZE, IMAGE_SIZE);
	ctx.stroke();
	ctx.fill();
	ctx.clip();

	ctx.lineWidth = 1;
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

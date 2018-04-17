export function fillAscending(start, end) {
	var array = [], counter = start;
	while (counter < end) {
		array.push(counter++);
	}
	return array;
}

export function circleInSquare(x, y, r) {
	return (x - r >= 0 &&
		x + r <= 1 &&
		y - r >= 0 &&
		y + r <= 1);
}

export function iou(x1, y1, x2, y2, r) {
	// calculate intersection over union of two circle with the same radius `r`
	// x1, x2, y1, y2 represent the coordinates of the two center points of the circles
	d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

	intersection = 2 * r * r * Math.acos(d / (2 * r)) - 0.5 * d * Math.sqrt(4 * r * r - d * d);
	union = 2 * Math.PI * r * r;

	return intersection / (union - intersection);
}

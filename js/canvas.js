const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const ctx = canvas.getContext("2d");

// write a function that generates a desired amount of circles
// stars = [];
// const genStars = (numStars) => {
// 	for (let i = 0; i < numStars; i++) {
// 		ctx.beginPath();

// 		let x = Math.floor(Math.random() * canvas.width);
// 		let y = Math.floor(Math.random() * canvas.height);
// 		let radius = Math.ceil(Math.random() * 2)
// 		if (radius < x < canvas.width && radius < y < canvas.height) {
// 			ctx.arc(x, y, radius, 0, Math.PI * 2)
// 			ctx.fillStyle = "white";
// 			stars.push(ctx.fill());
// 			ctx.closePath();
// 		}
// 	}

// }

// genStars(500);

// let starX = Math.random() * canvas.width;
// let starY = Math.random() * canvas.height;
// let starRadius = Math.ceil(Math.random() * 2);
// let starDY = Math.random() * (-5);

function Star (x, y, dy, radius) {
	this.x = x;
	this.y = y;
	this.dy = dy;
	this.radius = radius;

	this.draw = function () {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}
	this.update = function () {
		if (this.y + this.radius >= canvas.height) {
			this.y = this.radius;
		}
	}
	this.move = function() {
		this.y += this.dy;
	}
}

const stars = [];

for (i = 0; i < 500; i++) {
	let x = Math.random() * canvas.width;
	let y = Math.random() * canvas.height;
	let radius = Math.ceil(Math.random() * 2);
	let dy = Math.random() * (5);
	ctx.beginPath();
	ctx.fillStyle = "white";
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fill();
	stars.push(new Star(x, y, dy, radius))
}

// const star = new Star (100, 100, 5, 3);

function animateCanvas() {
	requestAnimationFrame(animateCanvas);
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < stars.length; i++) {
		stars[i].draw();
		stars[i].move();
		stars[i].update();
	}
}
animateCanvas();
// write a function to get the distance between two objects in the canvas

const getDistance = (x1, y1, x2, y2) => {
	// store dist between x and y coords in a variable
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	// use pythagoreon theorum to calc distance
	return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

// ***** EVENT LISTENERS *****

document.addEventListener("resize", function(event) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	animateCanvas();
})

// this allows player 1 and player 2 to move horizontally.
document.addEventListener("keydown", function(event) {
	const key = event.keyCode;
	// right using right arrow or D
	if(key===39 || key===68) {
		player1Ship.direction = "right";
		player1Ship.body.x = player1Ship.body.x + 10;
		player2Ship.direction = "right";
		player2Ship.body.x = player1Ship.body.x + 10;
	// left using left arrow or A
	} else if(key===37 || key===65) {
		player1Ship.direction = "left";
		player1Ship.body.x = player1Ship.body.x - 10;
		player2Ship.direction = "left";
		player2Ship.body.x = player1Ship.body.x - 10;
	}
}) 
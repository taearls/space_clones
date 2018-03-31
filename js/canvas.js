const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const ctx = canvas.getContext("2d");

// create star array to store new stars
const stars = [];

// generate 500 stars, push into star array
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

// animate the stars in canvas backdrop
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
const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const ctx = canvas.getContext("2d");

// write a function that generates a desired amount of circles
const genStars = (numCircles) => {
	for (let i = 0; i < numCircles; i++) {
		ctx.beginPath();

		let x = Math.floor(Math.random() * 1400);
		let y = Math.floor(Math.random() * 800);
		let radius = Math.ceil(Math.random() * 2)
		if (3 < x < 1400 && 3 < y < 800) {
			ctx.arc(x, y, radius, 0, Math.PI * 2)
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.closePath();
		}
	}
}

genStars(500);

// write a function to get the distance between two objects in the canvas

const getDistance = (x1, y1, x2, y2) => {
	// store dist between x and y coords in a variable
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	// use pythagoreon theorum to calc distance
	return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}

function animateCanvas() {
	ctx.clearRect(0,0, canvas.width, canvas.height)
	player1Ship.move(); 
	player1Ship.drawShip();

	// this next line starts the animation/recursion
	window.requestAnimationFrame(animateCanvas);

}

// this allows player 1 and player 2 to move horizontally.
document.addEventListener("keydown", function(event) {
	const key = event.keyCode;
	if(key===39) {
		player1Ship.direction = "right";
		player1Ship.body.x = player1Ship.body.x + 10;
		player2Ship.direction = "right";
		player2Ship.body.x = player1Ship.body.x + 10;
	} else if(key===37) {
		player1Ship.direction = "left";
		player1Ship.body.x = player1Ship.body.x - 10;
		player2Ship.direction = "left";
		player2Ship.body.x = player1Ship.body.x - 10;
	}
}) 
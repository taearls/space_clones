const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const ctx = canvas.getContext("2d");

// create star array to store new stars
let stars = [];

// generate 500 stars with function, push into star array
const initStars = () => {
	stars = [];
	for (i = 0; i < 500; i++) {
		let x = Math.random() * canvas.width;
		let y = Math.random() * canvas.height;
		let radius = Math.random() * 2;
		let dy = Math.random() * 5;
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
		stars.push(new Star(x, y, dy, radius))
	}
}
initStars();
// animate the stars in canvas backdrop
function animateStars() {
	requestAnimationFrame(animateStars);
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	for (let i = 0; i < stars.length; i++) {
		stars[i].draw();
		stars[i].update();
		stars[i].move();
	}
}

animateStars();

// ***** EVENT LISTENERS *****

// for some reason, stars speed up exponentially when window resizes, but they do regenerate as desired
window.addEventListener("resize", function(event) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	initStars();
	context=null;
	animateStars();
})

// ***** GAME CONTROLS *****

// this allows player 1 and player 2 to move horizontally.
document.addEventListener("keydown", function(event) {
	const key = event.keyCode;
	// console.log(event.keyCode);
	// PLAYER MOVEMENT
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
	} else if (key===32) {
		// space bar to fire
		// fire player ships
		console.log("ship fired laser");
		player1Ship.fire();
		player2Ship.fire();
	} else if (key===13) {
		// return to pause
		// pause the game
		console.log("game paused");
		game.pause();
	}
	ctx2.clearRect(0,0, canvas.width, canvas.height)
	player1Ship.draw();
}) 






// ***GAME CANVAS***

const gameCanvas = document.querySelector("#game-canvas");
gameCanvas.width = window.innerWidth;
// height will be distance between header/footer of game
gameCanvas.height = window.innerHeight;

const ctx2 = gameCanvas.getContext("2d");


// draw a rectangle for now.
// ctx2.rect() params are (x,y);
// x = x coord of upper left hand corner of rect
// y = y coord of upper left hand corner of rect
// for some reason y value increases as the points go vertically downward
// like the 4th quadrant of the cartesian plane


const playerShield = 1;
const playerFirepower = 1;
// instantiate ships for player 1 and player 2

const initPlayers = () => {
	player1Ship = new Player(playerFirepower, playerShield);
	player2Ship = new Player(playerFirepower, playerShield);
}


// call animation next

function animatePlayer() {
	ctx2.clearRect(0, 0, canvas.width, canvas.height)
	player1Ship.draw();
	player1Ship.move();
	player1Ship.fire();
	requestAnimationFrame(animatePlayer);
}

initPlayers();
player1Ship.initialize();
player1Ship.draw();
animatePlayer();

function animatePlayerFire() {
	ctx2.clearRect(0, 0, canvas.width, canvas.height);
	player1Ship.fire();
	requestAnimationFrame(animatePlayerFire);
}
// animatePlayerFire();

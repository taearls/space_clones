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

window.addEventListener("resize", function(event) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx2.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gameCanvas.width = window.innerWidth;
	gameCanvas.height = window.innerHeight;
	initStars();
	initPlayers();
	player1Ship.initialize();
	player1Ship.draw();
})










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
		player1Ship.initLaser();
	} else if (key===13) {
		// return to pause
		// pause the game
		console.log("game paused");
		game.pause();
	}
	ctx2.clearRect(0,0, canvas.width, canvas.height)
	player1Ship.draw();
}) 

document.addEventListener("keyup", function(event) {
	const key = event.keyCode;
	if(key===39 || key===68) {
		player1Ship.direction = "";
		// player1Ship.body.x = player1Ship.body.x + 10;
		player2Ship.direction = "";
		// player2Ship.body.x = player1Ship.body.x + 10;
	// left using left arrow or A
	} else if(key===37 || key===65) {
		player1Ship.direction = "";
		// player1Ship.body.x = player1Ship.body.x - 10;
		player2Ship.direction = "";
		// player2Ship.body.x = player1Ship.body.x - 10;
	}
})

// ***GAME CANVAS***

const gameCanvas = document.querySelector("#game-canvas");
gameCanvas.width = window.innerWidth;
// height will be distance between header/footer of game
gameCanvas.height = window.innerHeight;

const ctx2 = gameCanvas.getContext("2d");

const playerShield = 1;
const playerFirepower = 1;
// instantiate ships for player 1 and player 2

const initPlayers = () => {
	player1Ship = new Player(playerFirepower, playerShield);
	player2Ship = new Player(playerFirepower, playerShield);
}

function animatePlayer() {
	ctx2.clearRect(0, 0, canvas.width, canvas.height)
	player1Ship.draw();
	player1Ship.move();
	requestAnimationFrame(animatePlayer);
}

initPlayers();
player1Ship.initialize();
player1Ship.draw();
animatePlayer();

const amountClones = 30;
// cloneFactory.generateClone(new Clone());


function animatePlayerFire() {
	for (let i = 0; i < player1Ship.shotsFired.length; i++) {
		player1Ship.shotsFired[i].move();
	}
	requestAnimationFrame(animatePlayerFire);
}
animatePlayerFire();

for (let i = 0; i < amountClones; i++) {
	cloneFactory.generateClone(new Clone());
	cloneFactory.clones[i].initialize();
}

function animateClone() {
	for (let i = 0; i < cloneFactory.clones.length; i++) {
		// cloneFactory.clones[i].initialize();
		cloneFactory.clones[i].draw();
		cloneFactory.clones[i].move();
	}
	requestAnimationFrame(animateClone);
}
animateClone();

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const getDistance = (x1, y1, x2, y2) => {
	// store dist between x and y coords in a variable
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	// use pythagoreon theorum to calc distance
	return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}
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
	// initPlayer1();
	// initPlayer2();
	if (game.isPlayer1Turn) {
		player1Ship.initialize();
		player1Ship.draw();
	} else {
		player2Ship.initialize();
		player2Ship.draw();
	}
	
})








const laserSound = new Audio("audio/laser.wav")

document.addEventListener("keydown", function(event) {
	const key = event.keyCode;
	// console.log(event.keyCode);
	// PLAYER MOVEMENT
	// right using right arrow or D
	if(key===39 || key===68) {
		if (game.isPlayer1Turn) {
			player1Ship.direction = "right";
			player1Ship.body.x = player1Ship.body.x + 10;
		} else {
			player2Ship.direction = "right";
			player2Ship.body.x = player2Ship.body.x + 10;
		}
	// left using left arrow or A
	} else if(key===37 || key===65) {
		if (game.isPlayer1Turn) {
			player1Ship.direction = "left";
			player1Ship.body.x = player1Ship.body.x - 10;
		} else {
			player2Ship.direction = "left";
			player2Ship.body.x = player2Ship.body.x - 10;
		}
	} else if (key===32) {
		// space bar to fire
		if (game.isPlayer1Turn) {
			player1Ship.initLaser();
			game.totalShotsLevelPlayer1++;
			localStorage.setItem("player1totalshots", game.totalShotsLevelPlayer1++);
		} else {
			player2Ship.initLaser();
			game.totalShotsLevelPlayer2++;
			localStorage.setItem("player2totalshots", game.totalShotsLevelPlayer2++);
		}
		if (!game.isMuted) {
			laserSound.play();
   		} else {
    		laserSound.pause();
    	}
	} else if (key===13) {
		// return to pause
		// pause the game
		game.pause();
	} else if (key===27) {
		game.reset();
	} 
	ctx2.clearRect(0,0, canvas.width, canvas.height)
	player1Ship.draw();
}) 

// player will stop when arrow isn't pressed
document.addEventListener("keyup", function(event) {
	const key = event.keyCode;
	if(key===39 || key===68) {
		if (game.isPlayer1Turn) {
			player1Ship.direction = "";
		} else {
			player2Ship.direction = "";
		}
	// left using left arrow or A
	} else if(key===37 || key===65) {
		if (game.isPlayer1Turn) {
			player1Ship.direction = "";
		} else {
			player2Ship.direction = "";
		}
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

const initPlayer1 = () => {
	player1Ship = new Player(playerFirepower, playerShield);
}


const initPlayer2 = () => {
	player2Ship = new Player(playerFirepower, playerShield);
}
const animatePlayer = () => {
	ctx2.clearRect(0, 0, canvas.width, canvas.height)
	let playerShip;
	if (game.isPlayer1Turn === true) {
		playerShip = player1Ship;
	} else {
		playerShip = player2Ship;
	}
	playerShip.draw();
	playerShip.move();
	cancelMe1 = requestAnimationFrame(animatePlayer);
}

initPlayer1();
player1Ship.initialize();
player1Ship.draw();

initPlayer2();
player2Ship.initialize();
player2Ship.initialize();


const animatePlayerFire = () => {
	// check if player 1 turn or player 2 turn
	let playerShip;
	if (game.isPlayer1Turn === true) {
		playerShip = player1Ship;
	} else {
		playerShip = player2Ship;
	}
	for (let i = 0; i < playerShip.shotsFired.length; i++) {

		playerShip.shotsFired[i].move();
		let playerLaser = playerShip.shotsFired[i];
		if (playerLaser != undefined) {

			let x1 = playerLaser.x;
			let y1 = playerLaser.y;
			let width1 = playerShip.shotsFired[i].width;
			let height1 = playerShip.shotsFired[i].height;
			let xPlayerCenter = x1 + (width1 / 2);
			let yPlayerCenter = y1 + (height1 / 2)
			if (cloneFactory.clones.length > 0) {
				for (let j = 0; j < cloneFactory.clones.length; j++) {
					let x2 = cloneFactory.clones[j].body.x;
					let y2 = cloneFactory.clones[j].body.y;
					let xCloneCenter = x2 + (cloneFactory.clones[j].body.width / 2);
					let yCloneCenter = y2 + (cloneFactory.clones[j].body.height / 2);
					// let distance = getDistance(x1, y1, x2, y2);
					let playerTLDistToCenter = getDistance(x1, y1, xCloneCenter, yCloneCenter);
					let playerTRDistToCenter = getDistance(x1 + width1, y1, xCloneCenter, yCloneCenter);
					let playerBLDistToCenter = getDistance(x1, y1 + height1, xCloneCenter, yCloneCenter);
					let playerBRDistToCenter = getDistance(x1 + width1, y1 + height1, xCloneCenter, yCloneCenter);
					// while using the center point of the alien ships, I only need to measure two distances for comparison:
					let cloneDist1 = getDistance(x2, y2, xCloneCenter, yCloneCenter);
					let cloneDist2 = getDistance(x2, y2 + cloneFactory.clones[j].body.height, xCloneCenter, yCloneCenter);
			
					if (playerTLDistToCenter <= cloneDist1 || playerTLDistToCenter <= cloneDist2) {
						game.die(cloneFactory.clones[j]);
						playerLaser.disappear(playerShip, playerLaser);
					} else if (playerTRDistToCenter <= cloneDist1 || playerTRDistToCenter <= cloneDist2) {
						game.die(cloneFactory.clones[j]);
						playerLaser.disappear(playerShip, playerLaser);
					} else if (playerBLDistToCenter <= cloneDist1 || playerBLDistToCenter <= cloneDist2) {
						game.die(cloneFactory.clones[j]);
						playerLaser.disappear(playerShip, playerLaser);
					} else if (playerBRDistToCenter <= cloneDist1 || playerBRDistToCenter <= cloneDist2) {
						game.die(cloneFactory.clones[j]);
						playerLaser.disappear(playerShip, playerLaser);
					}
				}
			} else {
				for (let k = 0; k < mothershipFactory.motherships.length; k++) {
					// let playerLaser = player1Ship.shotsFired[i];
					// let x1 = player1Ship.shotsFired[i].x;
					// let y1 = player1Ship.shotsFired[i].y;
					// let width1 = player1Ship.shotsFired[i].width;
					// let height1 = player1Ship.shotsFired[i].height;
					let x2 = mothershipFactory.motherships[k].body.x;
					let y2 = mothershipFactory.motherships[k].body.y;
					// let xPlayer1Center = x1 + (width1 / 2);
					// let yPlayer1Center = y1 + (height1 / 2)
					let xMothershipCenter = x2 + (mothershipFactory.motherships[k].body.width / 2);
					let yMothershipCenter = y2 + (mothershipFactory.motherships[k].body.height / 2);
					// let distance = getDistance(x1, y1, x2, y2);
					let playerTLDistToCenter = getDistance(x1, y1, xMothershipCenter, yMothershipCenter);
					let playerTRDistToCenter = getDistance(x1 + width1, y1, xMothershipCenter, yMothershipCenter);
					let playerBLDistToCenter = getDistance(x1, y1 + height1, xMothershipCenter, yMothershipCenter);
					let playerBRDistToCenter = getDistance(x1 + width1, y1 + height1, xMothershipCenter, yMothershipCenter);
					// while using the center point of the alien ships, I only need to measure two distances for comparison:
					let mothershipDist1 = getDistance(x2, y2, xMothershipCenter, yMothershipCenter);
					let mothershipDist2 = getDistance(x2, y2 + mothershipFactory.motherships[k].body.height, xMothershipCenter, yMothershipCenter);
					
					if (playerTLDistToCenter <= mothershipDist1 || playerTLDistToCenter <= mothershipDist2) {
						playerLaser.disappear(playerShip, playerLaser);
						game.hitMothership(mothershipFactory.motherships[k])
					} else if (playerTRDistToCenter <= mothershipDist1 || playerTRDistToCenter <= mothershipDist2) {
						playerLaser.disappear(playerShip, playerLaser);
						game.hitMothership(mothershipFactory.motherships[k])		
					} else if (playerBLDistToCenter <= mothershipDist1 || playerBLDistToCenter <= mothershipDist2) {
						playerLaser.disappear(playerShip, playerLaser);
						game.hitMothership(mothershipFactory.motherships[k]);
					} else if (playerBRDistToCenter <= mothershipDist1 || playerBRDistToCenter <= mothershipDist2) {
						playerLaser.disappear(playerShip, playerLaser);
						game.hitMothership(mothershipFactory.motherships[k]);
					}
				}
			}
		}
	}
	cancelMe2 = requestAnimationFrame(animatePlayerFire);
}

const animateClone = () => {
	// check if player 1 or player 2 turn
	let playerShip;
	if (game.isPlayer1Turn) {
		playerShip = player1Ship;
	} else {
		playerShip = player2Ship;
	}
	for (let j = 0; j < cloneFactory.clones.length; j++) {
		cloneFactory.clones[j].update();
		cloneFactory.clones[j].draw();
		cloneFactory.clones[j].move();

		const randomNumber = Math.floor(Math.random() * 100);
		if(randomNumber === 26) {
			cloneFactory.clones[j].fire();
		}		
		if (cloneFactory.clones.length > 0) {
			for(let k = 0; k < cloneFactory.clones[j].shotsFired.length; k++) {
				let enemyLaser = cloneFactory.clones[j].shotsFired[k];
				enemyLaser.draw();
				enemyLaser.move();
				let x3 = enemyLaser.x;
				let y3 = enemyLaser.y;
				let width3 = enemyLaser.width;
				let height3 = enemyLaser.height;

				let x2 = playerShip.body.x;
				let y2 = playerShip.body.y;
				let xLaserCenter = x3 + (width3 / 2);
				let yLaserCenter = y3 + (height3 / 2);

				let xPlayerCenter = x2 + (playerShip.body.width / 2);
				let yPlayerCenter = y2 + (playerShip.body.height / 2);
				// let distance = getDistance(x1, y1, x2, y2);
				let laserTLDistToCenter = getDistance(x3, y3, xPlayerCenter, yPlayerCenter);
				let laserTRDistToCenter = getDistance(x3 + width3, y3, xPlayerCenter, yPlayerCenter);
				let laserBLDistToCenter = getDistance(x3, y3 + height3, xPlayerCenter, yPlayerCenter);
				let laserBRDistToCenter = getDistance(x3 + width3, y3 + height3, xPlayerCenter, yPlayerCenter);
				// while using the center point of the alien ships, I only need to measure two distances for comparison:
				let playerDist1 = getDistance(x2, y2, xPlayerCenter, yPlayerCenter);
				let playerDist2 = getDistance(x2, y2 + playerShip.body.height, xPlayerCenter, yPlayerCenter);

				// if alien shoots player
				if (laserTLDistToCenter <= playerDist1 || laserTLDistToCenter <= playerDist2) {
					enemyLaser.disappear(cloneFactory.clones[j], enemyLaser);
					game.die(playerShip);
				} else if (laserTRDistToCenter <= playerDist1 || laserTRDistToCenter <= playerDist2) {
					enemyLaser.disappear(cloneFactory.clones[j], enemyLaser);
					game.die(playerShip);
				} else if (laserBLDistToCenter <= playerDist1 || laserBLDistToCenter <= playerDist2) {
					enemyLaser.disappear(cloneFactory.clones[j], enemyLaser);
					game.die(playerShip);
				} else if (laserBRDistToCenter <= playerDist1 || laserBRDistToCenter <= playerDist2) {
					enemyLaser.disappear(cloneFactory.clones[j], enemyLaser);
					game.die(playerShip);
				}
			}

			let x1 = cloneFactory.clones[j].body.x;
			let y1 = cloneFactory.clones[j].body.y;
			let width1 = cloneFactory.clones[j].body.width;
			let height1 = cloneFactory.clones[j].body.height;

			let x2 = playerShip.body.x;
			let y2 = playerShip.body.y;
			let xCloneCenter = x1 + (width1 / 2);
			let yCloneCenter = y1 + (height1 / 2);

			let xPlayerCenter = x2 + (playerShip.body.width / 2);
			let yPlayerCenter = y2 + (playerShip.body.height / 2);
			// let distance = getDistance(x1, y1, x2, y2);
			let cloneTLDistToCenter = getDistance(x1, y1, xPlayerCenter, yPlayerCenter);
			let cloneTRDistToCenter = getDistance(x1 + width1, y1, xPlayerCenter, yPlayerCenter);
			let cloneBLDistToCenter = getDistance(x1, y1 + height1, xPlayerCenter, yPlayerCenter);
			let cloneBRDistToCenter = getDistance(x1 + width1, y1 + height1, xPlayerCenter, yPlayerCenter);
			// while using the center point of the alien ships, I only need to measure two distances for comparison:
			let playerDist1 = getDistance(x2, y2, xPlayerCenter, yPlayerCenter);
			let playerDist2 = getDistance(x2, y2 + playerShip.body.height, xPlayerCenter, yPlayerCenter);
			
			// if alien and player crash into each other
			if (cloneTLDistToCenter <= playerDist1 || cloneTLDistToCenter <= playerDist2) {
				game.die(cloneFactory.clones[j]);
				game.die(playerShip);
			} else if (cloneTRDistToCenter <= playerDist1 || cloneTRDistToCenter <= playerDist2) {
				game.die(cloneFactory.clones[j]);
				game.die(playerShip);
			} else if (cloneBLDistToCenter <= playerDist1 || cloneBLDistToCenter <= playerDist2) {
				game.die(cloneFactory.clones[j]);
				game.die(playerShip);
			} else if (cloneBRDistToCenter <= playerDist1 || cloneBRDistToCenter <= playerDist2) {
				game.die(cloneFactory.clones[j]);
				game.die(playerShip);
			}
		}
	}// for all clones
	cancelMe3 = requestAnimationFrame(animateClone);
}

const animateMothership = () => {
	let playerShip;
	if (game.isPlayer1Turn) {
		playerShip = player1Ship;
	} else {
		playerShip = player2Ship;
	}
	for (let j = 0; j < mothershipFactory.motherships.length; j++) {
		mothershipFactory.motherships[j].update();
		mothershipFactory.motherships[j].draw();
		mothershipFactory.motherships[j].move();

		const randomNumber = Math.floor(Math.random() * 30);
		if(randomNumber === 26) {
			mothershipFactory.motherships[j].fire();
		}		
		if (mothershipFactory.motherships[0].shotsFired.length > 0) {
			for(let k = 0; k < mothershipFactory.motherships[j].shotsFired.length; k++) {
				let enemyLaser = mothershipFactory.motherships[j].shotsFired[k];
				enemyLaser.draw();
				enemyLaser.move();
				let x3 = enemyLaser.x;
				let y3 = enemyLaser.y;
				let width3 = enemyLaser.width;
				let height3 = enemyLaser.height;

				let x2 = playerShip.body.x;
				let y2 = playerShip.body.y;
				let xLaserCenter = x3 + (width3 / 2);
				let yLaserCenter = y3 + (height3 / 2);

				let xPlayerCenter = x2 + (playerShip.body.width / 2);
				let yPlayerCenter = y2 + (playerShip.body.height / 2);
				// let distance = getDistance(x1, y1, x2, y2);
				let laserTLDistToCenter = getDistance(x3, y3, xPlayerCenter, yPlayerCenter);
				let laserTRDistToCenter = getDistance(x3 + width3, y3, xPlayerCenter, yPlayerCenter);
				let laserBLDistToCenter = getDistance(x3, y3 + height3, xPlayerCenter, yPlayerCenter);
				let laserBRDistToCenter = getDistance(x3 + width3, y3 + height3, xPlayerCenter, yPlayerCenter);
				// while using the center point of the alien ships, I only need to measure two distances for comparison:
				let playerDist1 = getDistance(x2, y2, xPlayerCenter, yPlayerCenter);
				let playerDist2 = getDistance(x2, y2 + playerShip.body.height, xPlayerCenter, yPlayerCenter);

				// if mothership shoots player
				if (laserTLDistToCenter <= playerDist1 || laserTLDistToCenter <= playerDist2) {
					enemyLaser.disappearMS(mothershipFactory.motherships[j], enemyLaser);
					mothershipFactory.motherships[j].shotsFired = [];
					game.die(playerShip);
				} else if (laserTRDistToCenter <= playerDist1 || laserTRDistToCenter <= playerDist2) {
					enemyLaser.disappearMS(mothershipFactory.motherships[j], enemyLaser);
					mothershipFactory.motherships[j].shotsFired = [];
					game.die(playerShip);
				} else if (laserBLDistToCenter <= playerDist1 || laserBLDistToCenter <= playerDist2) {
					enemyLaser.disappearMS(mothershipFactory.motherships[j], enemyLaser);
					mothershipFactory.motherships[j].shotsFired = [];
					game.die(playerShip);
				} else if (laserBRDistToCenter <= playerDist1 || laserBRDistToCenter <= playerDist2) {
					enemyLaser.disappearMS(mothershipFactory.motherships[j], enemyLaser);
					mothershipFactory.motherships[j].shotsFired = []; 
					game.die(playerShip);
				}
			}
		}	
	}
	cancelMe4 = requestAnimationFrame(animateMothership);
}


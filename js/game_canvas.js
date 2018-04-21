const getDistance = (x1, y1, x2, y2) => {
	// store dist between x and y coords in a variable
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	// use pythagoreon theorum to calc distance
	return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}
// create star array to store new stars
const stars = [];
// generate 500 stars with function, push into star array
const initStars = () => {
	for (i = 0; i < 200; i++) {
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

window.addEventListener("resize", function(event) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
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
function addKeys (){
document.addEventListener("keydown", function addKeys(event) {
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
	ctx.clearRect(0,0, canvas.width, canvas.height)
}) 
}


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

addKeys();
// ***GAME CANVAS***

const canvas = document.querySelector("#game-canvas");
canvas.width = window.innerWidth;
// height will be distance between header/footer of game
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const playerShield = 1;
const playerFirepower = 1;
// instantiate ships for player 1 and player 2
const initPlayer1 = () => {
	player1Ship = new Player(playerFirepower, playerShield);
}
const initPlayer2 = () => {
	player2Ship = new Player(playerFirepower, playerShield);
}
initPlayer1();
player1Ship.initialize();
initPlayer2();
player2Ship.initialize();
initStars();

const animateGame = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// background animation
	for (let i = 0; i < stars.length; i++) {
		stars[i].draw();
		stars[i].update();
		stars[i].move();
	}
	// player animation
	let playerShip;
	if (game.isPlayer1Turn === true) {
		playerShip = player1Ship;
	} else {
		playerShip = player2Ship;
	}

	playerShip.draw();
	playerShip.move();

	let xPlayer = playerShip.body.x;
	let yPlayer = playerShip.body.y;
	let widthPlayer = playerShip.body.width;
	let heightPlayer = playerShip.body.height;
	let xPlayerCenter = xPlayer + (widthPlayer / 2);
	let yPlayerCenter = yPlayer + (heightPlayer / 2);

	let playerDist1 = getDistance(xPlayer, yPlayer, xPlayerCenter, yPlayerCenter);
	let playerDist2 = getDistance(xPlayer, yPlayer + heightPlayer, xPlayerCenter, yPlayerCenter);

	for (let i = 0; i < playerShip.shotsFired.length; i++) {
		playerShip.shotsFired[i].move();
		let playerLaser = playerShip.shotsFired[i];
		if (playerLaser != undefined) {
		let xPlayerLaser = playerLaser.x;
		let yPlayerLaser = playerLaser.y;
		let widthPlayerLaser = playerLaser.width;
		let heightPlayerLaser = playerLaser.height;
		 // if player shoots clone
		 	for (let j = 0; j < cloneFactory.clones.length; j++) {
		 		let xClone = cloneFactory.clones[j].body.x;
				let yClone = cloneFactory.clones[j].body.y;
				let widthClone = cloneFactory.clones[j].body.width;
				let heightClone = cloneFactory.clones[j].body.height;

				let xCloneCenter = xClone + (widthClone / 2);
				let yCloneCenter = yClone + (heightClone / 2);
				let pLaserTLDistToCCenter = getDistance(xPlayerLaser, yPlayerLaser, xCloneCenter, yCloneCenter);
				let pLaserTRDistToCCenter = getDistance(xPlayerLaser + widthPlayerLaser, yPlayerLaser, xCloneCenter, yCloneCenter);
				let pLaserBLDistToCCenter = getDistance(xPlayerLaser, yPlayerLaser + heightPlayerLaser, xCloneCenter, yCloneCenter);
				let pLaserBRDistToCCenter = getDistance(xPlayerLaser + widthPlayerLaser, yPlayerLaser + heightPlayerLaser, xCloneCenter, yCloneCenter);
						
				// while using the center point of the alien ships, I only need to measure two distances for comparison:
				let cloneDist1 = getDistance(xClone, yClone, xCloneCenter, yCloneCenter);
				let cloneDist2 = getDistance(xClone, yClone + heightClone, xCloneCenter, yCloneCenter);

				// if player hits clone
				if (pLaserTLDistToCCenter <= cloneDist1 || pLaserTLDistToCCenter <= cloneDist2) {
					playerLaser.shipHit(playerShip, playerLaser);
					game.die(cloneFactory.clones[j]);
				} else if (pLaserTRDistToCCenter <= cloneDist1 || pLaserTRDistToCCenter <= cloneDist2) {
					playerLaser.shipHit(playerShip, playerLaser);
					game.die(cloneFactory.clones[j]);
				} else if (pLaserBLDistToCCenter <= cloneDist1 || pLaserBLDistToCCenter <= cloneDist2) {
					playerLaser.shipHit(playerShip, playerLaser);
					game.die(cloneFactory.clones[j]);
				} else if (pLaserBRDistToCCenter <= cloneDist1 || pLaserBRDistToCCenter <= cloneDist2) {
					playerLaser.shipHit(playerShip, playerLaser);
					game.die(cloneFactory.clones[j]);
				}
			}

			for (let k = 0; k < mothershipFactory.motherships.length; k++) {

						let xMShip = mothershipFactory.motherships[k].body.x;
						let yMShip = mothershipFactory.motherships[k].body.y;
						let xMShipCenter = xMShip + (mothershipFactory.motherships[k].body.width / 2);
						let yMShipCenter = yMShip + (mothershipFactory.motherships[k].body.height / 2);

						let pLaserTLDistToMSCenter = getDistance(xPlayerLaser, yPlayerLaser, xMShipCenter, yMShipCenter);
						let pLaserTRDistToMSCenter = getDistance(xPlayerLaser + widthPlayerLaser, yPlayerLaser, xMShipCenter, yMShipCenter);
						let pLaserBLDistToMSCenter = getDistance(xPlayerLaser, yPlayerLaser + heightPlayerLaser, xMShipCenter, yMShipCenter);
						let pLaserBRDistToMSCenter = getDistance(xPlayerLaser + widthPlayerLaser, yPlayerLaser + heightPlayerLaser, xMShipCenter, yMShipCenter);
						
						// while using the center point of the alien ships, I only need to measure two distances for comparison:
						let mothershipDist1 = getDistance(xMShip, yMShip, xMShipCenter, yMShipCenter);
						let mothershipDist2 = getDistance(xMShip, yMShip + mothershipFactory.motherships[k].body.height, xMShipCenter, yMShipCenter);
						
						// if player hits mothership
						if (pLaserTLDistToMSCenter <= mothershipDist1 || pLaserTLDistToMSCenter <= mothershipDist2) {
							playerLaser.shipHit(playerShip, playerLaser);
							game.hitMothership(mothershipFactory.motherships[k])
						} else if (pLaserTRDistToMSCenter <= mothershipDist1 || pLaserTRDistToMSCenter <= mothershipDist2) {
							playerLaser.shipHit(playerShip, playerLaser);
							game.hitMothership(mothershipFactory.motherships[k])		
						} else if (pLaserBLDistToMSCenter <= mothershipDist1 || pLaserBLDistToMSCenter <= mothershipDist2) {
							playerLaser.shipHit(playerShip, playerLaser);
							game.hitMothership(mothershipFactory.motherships[k]);
						} else if (pLaserBRDistToMSCenter <= mothershipDist1 || pLaserBRDistToMSCenter <= mothershipDist2) {
							playerLaser.shipHit(playerShip, playerLaser);
							game.hitMothership(mothershipFactory.motherships[k]);
						}
			}
		}
	}






		// mothership animation
		for (let j = 0; j < mothershipFactory.motherships.length; j++) {
			mothershipFactory.motherships[j].update();
			mothershipFactory.motherships[j].draw();
			mothershipFactory.motherships[j].move();

			const msNumber = Math.floor(Math.random() * 100);
			if(msNumber === 26) {
				mothershipFactory.motherships[j].fire();
			}		
			if (mothershipFactory.motherships[0].shotsFired.length > 0) {
				for(let k = 0; k < mothershipFactory.motherships[j].shotsFired.length; k++) {
					let mothershipLaser = mothershipFactory.motherships[j].shotsFired[k];
					mothershipLaser.draw();
					mothershipLaser.move();
					let xMLaser = mothershipLaser.x;
					let yMLaser = mothershipLaser.y;
					let widthMLaser = mothershipLaser.width;
					let heightMLaser = mothershipLaser.height;

					let mlaserTLDistToCenter = getDistance(xMLaser, yMLaser, xPlayerCenter, yPlayerCenter);
					let mlaserTRDistToCenter = getDistance(xMLaser + widthMLaser, yMLaser, xPlayerCenter, yPlayerCenter);
					let mlaserBLDistToCenter = getDistance(xMLaser, yMLaser + heightMLaser, xPlayerCenter, yPlayerCenter);
					let mlaserBRDistToCenter = getDistance(xMLaser + widthMLaser, yMLaser + heightMLaser, xPlayerCenter, yPlayerCenter);
					
					// if mothership shoots player
					if (mlaserTLDistToCenter <= playerDist1 || mlaserTLDistToCenter <= playerDist2) {
						mothershipLaser.mothershipHit(mothershipFactory.motherships[j], mothershipLaser);
						mothershipFactory.motherships[j].shotsFired = [];
						game.die(playerShip);
					} else if (mlaserTRDistToCenter <= playerDist1 || mlaserTRDistToCenter <= playerDist2) {
						mothershipLaser.mothershipHit(mothershipFactory.motherships[j], mothershipLaser);
						mothershipFactory.motherships[j].shotsFired = [];
						game.die(playerShip);
					} else if (mlaserBLDistToCenter <= playerDist1 || mlaserBLDistToCenter <= playerDist2) {
						mothershipLaser.mothershipHit(mothershipFactory.motherships[j], mothershipLaser);
						mothershipFactory.motherships[j].shotsFired = [];
						game.die(playerShip);
					} else if (mlaserBRDistToCenter <= playerDist1 || mlaserBRDistToCenter <= playerDist2) {
						mothershipLaser.mothershipHit(mothershipFactory.motherships[j], mothershipLaser);
						mothershipFactory.motherships[j].shotsFired = []; 
						game.die(playerShip);
					}

						// if player shoots mothership	


				}
			}
		}
		// clone animation
		for (let j = 0; j < cloneFactory.clones.length; j++) {
			cloneFactory.clones[j].update();
			cloneFactory.clones[j].draw();
			cloneFactory.clones[j].move();

			const cNumber = Math.floor(Math.random() * 300);
			if(cNumber === 26) {
				cloneFactory.clones[j].fire();
			}		
			if (cloneFactory.clones.length > 0 && cloneFactory.clones[j].shotsFired != undefined) {
				for(let k = 0; k < cloneFactory.clones[j].shotsFired.length; k++) {
					let cloneLaser = cloneFactory.clones[j].shotsFired[k];
					cloneLaser.draw();
					cloneLaser.move();
					let xCLaser = cloneLaser.x;
					let yCLaser = cloneLaser.y;
					let widthCLaser = cloneLaser.width;
					let heightCLaser = cloneLaser.height;
					let xCLaserCenter = xCLaser + (widthCLaser / 2);
					let yCLaserCenter = yCLaser + (heightCLaser / 2);

					let cLaserTLDistToCenter = getDistance(xCLaser, yCLaser, xPlayerCenter, yPlayerCenter);
					let cLaserTRDistToCenter = getDistance(xCLaser + widthCLaser, yCLaser, xPlayerCenter, yPlayerCenter);
					let cLaserBLDistToCenter = getDistance(xCLaser, yCLaser + heightCLaser, xPlayerCenter, yPlayerCenter);
					let cLaserBRDistToCenter = getDistance(xCLaser + widthCLaser, yCLaser + heightCLaser, xPlayerCenter, yPlayerCenter);
					// while using the center point of the alien ships, I only need to measure two distances for comparison:

					// if clone shoots player
					if (cLaserTLDistToCenter <= playerDist1 || cLaserTLDistToCenter <= playerDist2) {
						cloneLaser.shipHit(cloneFactory.clones[j], cloneLaser);
						game.die(playerShip);
					} else if (cLaserTRDistToCenter <= playerDist1 || cLaserTRDistToCenter <= playerDist2) {
						cloneLaser.shipHit(cloneFactory.clones[j], cloneLaser);
						game.die(playerShip);
					} else if (cLaserBLDistToCenter <= playerDist1 || cLaserBLDistToCenter <= playerDist2) {
						cloneLaser.shipHit(cloneFactory.clones[j], cloneLaser);
						game.die(playerShip);
					} else if (cLaserBRDistToCenter <= playerDist1 || cLaserBRDistToCenter <= playerDist2) {
						cloneLaser.shipHit(cloneFactory.clones[j], cloneLaser);
						game.die(playerShip);
					}
				}

				let xClone = cloneFactory.clones[j].body.x;
				let yClone = cloneFactory.clones[j].body.y;
				let widthClone = cloneFactory.clones[j].body.width;
				let heightClone = cloneFactory.clones[j].body.height;

				let xCloneCenter = xClone + (widthClone / 2);
				let yCloneCenter = yClone + (heightClone / 2);

				// let distance = getDistance(x1, y1, x2, y2);
				let cloneTLDistToCenter = getDistance(xClone, yClone, xPlayerCenter, yPlayerCenter);
				let cloneTRDistToCenter = getDistance(xClone + widthClone, yClone, xPlayerCenter, yPlayerCenter);
				let cloneBLDistToCenter = getDistance(xClone, yClone + heightClone, xPlayerCenter, yPlayerCenter);
				let cloneBRDistToCenter = getDistance(xClone + widthClone, yClone + heightClone, xPlayerCenter, yPlayerCenter);
				
				// if clone and player crash into each other
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
		}
	cancelMe = requestAnimationFrame(animateGame);
}


// ***** GLOBAL VARIABLES *****
const queryString = window.location.href.split('?')[1];
const isSolo = (queryString === "players=1" ? true : false);

// EVENT LISTENER VARIABLES

const closePause = $(".close-pause");
const resetGame = $("#reset-game");
const muteButton = $("#mute-button");
const endLevelModal = $(".end-level-modal");
const endLevelMessage = $("#end-level-message");
const playerAccuracy = $("#player-accuracy");
const nextLevel = $(".next-level");
const endLevelScore = $("#end-level-score");
const endLevelMute = $("#end-level-mute");
const endLevelReset = $("#end-level-reset");
const playerTurn = $("#player-turn");
const startTurn = $(".start-turn");
const gameOverModal = $(".game-over-modal");
const endGameOver = $("#game-over-button");

let initialClones = 10;

const game = {
	highScore: localStorage.getItem("highscore") > 5000 ? localStorage.getItem("highscore") : 5000,
	player1Score: localStorage.getItem('player1score') || 0,
	player1Lives: localStorage.getItem('player1lives') || 3,
	player2Score: localStorage.getItem('player2score') || 0,
	player2Lives: localStorage.getItem('player2lives') || 3,
	player1Clones: localStorage.getItem('player1clones') || 10,
	player2Clones: localStorage.getItem('player2clones') || 10,
	player1MotherShip: localStorage.getItem('player1mothership') || 10,
	player2MotherShip: localStorage.getItem('player2mothership') || 10,
	player1Level: localStorage.getItem('player1level') || 1,
	player2Level: localStorage.getItem('player2level') || 1,
	isSolo: isSolo,
	isPlayer1Turn: true,
	player1IsDead: false,
	player2IsDead: false,
	isPaused: false,
	betweenTurns: false,
	accurateShotsPlayer1: localStorage.getItem('player1accshots'),
	totalShotsLevelPlayer1: localStorage.getItem('player1totalshots'),
	percentAccuracyPlayer1: (localStorage.getItem('player1accshots') / localStorage.getItem('player1totalshots') * 100),
	accurateShotsPlayer2: localStorage.getItem('player2accshots'),
	totalShotsLevelPlayer2: localStorage.getItem('player2totalshots'),
	percentAccuracyPlayer2: (localStorage.getItem('player2accshots') / localStorage.getItem('player2totalshots') * 100),
	isMuted: false,
	animation1: true,
	maxClones: 20,
	bossLevel: false,
	currentLevel: 1,
	playerSwitch() {
		const player = this.isPlayer1Turn ? "Player 1" : "Player 2";
		const otherPlayer = this.isPlayer1Turn ? "Player 2" : "Player 1";
		this.isPlayer1Turn = !this.isPlayer1Turn;
		this.betweenTurns = !this.betweenTurns;
	
		if (this.betweenTurns) {
			playerTurn.text(`${player} has died.`);
			startTurn.text(`${otherPlayer} Start Turn`);
			$(".turn-switch-modal").addClass("show-modal");
			stopAnimatons();
		}
	},
	startTurn() {
		// display player 1 start or player 2 start
		// switch all stats displayed // affected

		// readjusts player 1 and player 2 image while still instantiating from same Player class
		if (this.isPlayer1Turn) {
			player1Ship.__proto__.draw = function() {		
				let x = this.body.x;
				let y = this.body.y;
				let width = this.body.width;
				let height = this.body.height;
				ctx.drawImage(playerImg, x, y);
			}
		} else {
			player2Ship.__proto__.draw = function() {		
				let x = this.body.x;
				let y = this.body.y;
				let width = this.body.width;
				let height = this.body.height;
				ctx.drawImage(player2Img, x, y);
			}
		}

		if (this.isPlayer1Turn) {
			$("#level").text(`Level: ${this.player1Level}`);
			$("#player-score").text(`Player 1 Score: ${this.player1Score}`);
			$("#lives").text(`Player 1 Lives: ${this.player1Lives}`);

			$("#turn-start").text("Player 1 Start");
			$("#turn-start").css("animation", "fadeAndScale 1s ease-in forwards");
			
			if (this.player1Clones === 0) {
				console.log('boom')
				this.bossLevel = true;
				mothershipFactory.motherships = [];
				initMothership(1);
				mothershipFactory.motherships[0].shield = this.player1MotherShip;
				$("#enemies-left").text(`Shield: ${this.player1MotherShip}`);
			} else {
				this.bossLevel = false;
				mothershipFactory.motherships = [];
				$("#enemies-left").text(`Clones: ${this.player1Clones}`);
				cloneFactory.clones = [];
				initClones(this.player1Clones);
			}
		} else {
			// check if 2nd player local storage is empty
			// need to set default local storage for 2nd player the first time
			if (this.player2Level === null) {
				localStorage.setItem("player2lives", 3);
				localStorage.setItem("player2score", 0);
				localStorage.setItem("player2accshots", 0);
				localStorage.setItem("player2totalshots", 0);
				localStorage.setItem("enemiesplayer2", 10);
				localStorage.setItem("player2mothership", 10);
				localStorage.setItem("player2level", 1);
			}

			$("#level").text(`Level: ${this.player2Level}`);
			$("#player-score").text(`Player 2 Score: ${this.player2Score}`);
			$("#lives").text(`Player 2 Lives: ${this.player2Lives}`);

			$("#turn-start").text("Player 2 Start");
			$("#turn-start").css("animation", "");
			$("#turn-start").css("animation", "fadeAndScale2 1s ease-in forwards");
			if (this.player2Clones === 0) {
				this.bossLevel = true;
				mothershipFactory.motherships = [];
				initMothership(1);
				mothershipFactory.motherships[0].shield = this.player2MotherShip;
				$("#enemies-left").text(`Shield: ${this.player2MotherShip}`);
			} else {
				this.bossLevel = false;
				// mothershipFactory.motherships = [];
				$("#enemies-left").text(`Clones: ${this.player2Clones}`);
				cloneFactory.clones = [];
				initClones(this.player2Clones);
			}
		}
		// reboot level where progress was made
	},
	pause() {
		this.isPaused = !this.isPaused;
		if (this.isPaused) {
			$(".pause-modal").addClass("show-modal");
			// stop animations
			cancelAnimationFrame(cancelMe);
		} else {
			// this makes it so I can press enter and toggle if it's paused
			$(".pause-modal").toggleClass("show-modal", false)
			this.isPaused = false;
			// resume animations
			cancelAnimationFrame(cancelMe);
			requestAnimationFrame(animateGame);
			event.stopPropagation();
		}
	},
	genLevel() {
		if (this.isPlayer1Turn) {
			this.player1Clones = `${Math.min(Number(initialClones) + this.player1Level * 1, this.maxClones)}`;
			localStorage.setItem("enemiesplayer1", this.player1Clones);
			$("#enemies-left").text(`Clones: ${this.player1Clones}`);		
			initClones(this.player1Clones);
		} else {
			this.player2Clones = `${Math.min(Number(initialClones) + this.player2Level * 1, this.maxClones)}`;
			localStorage.setItem("enemiesplayer2", this.player2Clones);
			$("#enemies-left").text(`Clones: ${this.player2Clones}`);
			initClones(this.player2Clones);
		}
		
	},
	endLevel() {
		laserFactory.lasers = [];
		this.currentLevel++;
		$("#level").text(`Level: ${this.currentLevel}`);

		endLevelModal.addClass("show-modal");
		endLevelMessage.text(`You beat Level ${this.currentLevel - 1}!`);
		nextLevel.text(`Begin Level ${this.currentLevel}`);
		if (this.isPlayer1Turn) {
			localStorage.setItem("player1level", this.currentLevel);
			endLevelScore.text(`Player 1 Score: ${this.player1Score}`);
			const accPercentPlayer1 = round(this.percentAccuracyPlayer1, 1);
			playerAccuracy.text(`Firing Accuracy: ${accPercentPlayer1}%`);
		} else {
			localStorage.setItem("player2level", this.currentLevel);
			endLevelScore.text(`Player 2 Score: ${this.player2Score}`);
			const accPercentPlayer1 = round(this.percentAccuracyPlayer2, 1);
			playerAccuracy.text(`Firing Accuracy: ${accPercentPlayer2}%`);
		}
	},
	initMothership() {
		laserFactory.lasers = [];
		initMothership(1);
		$("#enemies-left").text("Shield: 10");
	},
	hitMothership(mothership) {
		if (this.isPlayer1Turn) {
			mothership.shield--;
			localStorage.setItem("player1mothership", mothership.shield);
			$("#enemies-left").text(`Shield: ${this.player1MotherShip}`);
			this.accurateShotsPlayer1++;
			localStorage.setItem("player1accshots", this.accurateShotsPlayer1);
		} else {
			mothership.shield--;
			localStorage.setItem("player2mothership", mothership.shield);
			$("#enemies-left").text(`Shield: ${this.player2MotherShip}`);
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2);
		}
		if (mothership.shield <= 0) {
			this.killMothership(mothership);
		}
	},
	killMothership(mothership) {
		if (this.isPlayer1Turn) {
			this.player1Score += 1500;
			localStorage.setItem("player1score", this.player1Score);
			$("#player-score").text(`Player 1 Score: ${this.player1Score}`);
		} else {
			this.player2Score += 1500;
			localStorage.setItem("player2score", this.player2Score);
			$("#player-score").text(`Player 2 Score: ${this.player2Score}`);
		}

		if (mothership.shield <= 0) {
			const index = mothershipFactory.motherships.indexOf(mothership);
			mothershipFactory.motherships.splice(index, 1);
			if (mothershipFactory.motherships.length === 0) {
				this.endLevel();
			}
		}
	},
	score() {
		if (this.isPlayer1Turn) {
			this.player1Clones--;
			localStorage.setItem("enemiesplayer1", this.player1Clones);
			this.accurateShotsPlayer1++;
			localStorage.setItem("player1accshots", this.accurateShotsPlayer1);

			this.player1Score += 100;
			localStorage.setItem("player1score", this.player1Score);

			if (this.player1Score === 9000 || this.player1Score === 15000 || this.player1Score === 22000) {
				this.player1Lives++;
				localStorage.setItem("player1lives", this.player1Lives);
				$("#lives").text(`Player 1 Lives: ${this.player1Lives}`);
				if (this.animation1) {
					$("#extra-life").css("animation", "extraLives 1s ease-in forwards");
					this.animation1 = false;
				} else {
					$("#extra-life").css("animation", "extraLives2 1s ease-in forwards");
					this.animation1 = true;
				}
			}
			$("#player-score").text(`Player 1 Score: ${this.player1Score}`);

		} else {
			this.player2Clones--;
			localStorage.setItem("enemiesplayer2", this.player2Clones);
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2);

			this.player2Score += 100;
			localStorage.setItem("player2score", this.player2Score);

			if (this.player2Score === 9000 || this.player2Score === 15000 || this.player2Score === 22000) {
				this.player2Lives++;
				localStorage.setItem("player2lives", this.player2Lives);
				$("#lives").text(`Player 2 Lives: ${this.player2Lives}`);
				if (this.animation1) {
					$("#extra-life").css("animation", "extraLives 1s ease-in forwards");
					this.animation1 = false;
				} else {
					$("#extra-life").css("animation", "extraLives2 1s ease-in forwards");
					this.animation1 = true;
				}
			}
			$("#player-score").text(`Player 2 Score: ${this.player2Score}`);
		}
		
		// set high score updating conditions
		if (this.player1Score > this.player2Score && this.player1Score > this.highScore) {
			this.highScore = this.player1Score;
			localStorage.setItem("highscore", this.highScore);
			$("#high-score").text(`High Score: ${this.highScore}`);
		} else if (this.player2Score > this.player1Score && this.player2Score > this.highScore) {
			this.highScore = this.player2Score;
			localStorage.setItem("highscore", this.highScore);
			$("#high-score").text(`High Score: ${this.highScore}`);
		}
	},
	reset() {
		this.setDefault();
		returnToTitle();
	},
	setDefault() {
		this.isPaused = false;
		this.isMuted = false;
		localStorage.setItem("player1lives", 3);
		localStorage.setItem("player1score", 0);
		localStorage.setItem("player1accshots", 0);
		localStorage.setItem("player1totalshots", 0);
		localStorage.setItem("enemiesplayer1", 10);
		localStorage.setItem("player1mothership", 10);
		localStorage.setItem("player1level", 1)

		localStorage.setItem("player2lives", 3);
		localStorage.setItem("player2score", 0);
		localStorage.setItem("player2accshots", 0);
		localStorage.setItem("player2totalshots", 0);
		localStorage.setItem("enemiesplayer2", 10);
		localStorage.setItem("player2mothership", 10);
		localStorage.setItem("player2level", 1)
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	die(ship) {
		// if player dies
		if (ship === player1Ship || ship === player2Ship) {
			this.checkGameEnd();
		} else {
			// if a clone dies
			const index = cloneFactory.clones.indexOf(ship);
			cloneFactory.clones.splice(index, 1);
			if (this.isPlayer1Turn) {
				localStorage.setItem("enemiesplayer1", `${this.player1Clones - 1}`);
				this.score();
				$("#enemies-left").text(`Clones: ${this.player1Clones}`);
				if (this.player1Clones === 0) {
					this.initMothership();
				}
			} else {
				localStorage.setItem("enemiesplayer2", `${this.player2Clones - 1}`);
				this.score();
				$("#enemies-left").text(`Clones: ${this.player2Clones}`);
				if (this.player2Clones === 0) {
					this.initMothership();
				}
			}
		}
	},
	checkGameEnd() {
		if (this.isSolo) {
			this.player1Lives--;
			localStorage.setItem("player1lives", this.player1Lives);
			if (!this.player1IsDead) {
				$("#lives").text(`Player 1 Lives: ${this.player1Lives}`);
				if (this.player1Lives === 0) {
					this.player1IsDead = true;
					this.gameOver();
				}
			}
		} else {
			if (this.isPlayer1Turn) {
				this.player1Lives--;
				localStorage.setItem("player1lives", this.player1Lives);
				if (!this.player1IsDead) {
					$("#lives").text(`Player 1 Lives: ${this.player1Lives}`);
				}
				if (this.player1Lives === 0 && !this.player1IsDead) {
					this.player1IsDead = true;
					if (this.player1IsDead && this.player2IsDead) {
						this.gameOver();
					} else if (!this.player2IsDead) {
						this.playerSwitch();
					}
				} else if (!this.player2IsDead) {
					this.playerSwitch();
				}
			} else if (!this.isPlayer1Turn) {
				this.player2Lives--;
				localStorage.setItem("player2lives", this.player2Lives);
				if (!this.player2IsDead) {
					$("#lives").text(`Player 2 Lives: ${this.player2Lives}`);
				}

				if (this.player2Lives === 0 && !this.player2IsDead) {
					this.player2IsDead = true;
					if (this.player2IsDead && this.player1IsDead) {
						this.gameOver();
					} else if (!this.player1IsDead) {
						this.playerSwitch();
					}
				} else if (!this.player1IsDead) {
					this.playerSwitch();
				}
			}
		}
	},
	gameOver() {
		gameOverModal.addClass("show-modal");
		stopAnimatons();
	}
}




//  ***** MODALS *****

closePause.on("click", function(event) {
	$(this).parent().parent().toggleClass("show-modal", false);
	game.isPaused = false;
	stopAnimatons();
	cancelAnimationFrame(cancelMe);
	requestAnimationFrame(animateGame);
	event.stopPropagation();
});
resetGame.on("click", function(event) {
	game.reset();
});
endLevelReset.on("click", function(event){
	game.reset();
});
muteButton.on("click", function(){
	game.isMuted = !game.isMuted;
	if (game.isMuted) {
		muteButton.text("Unmute");
		endLevelMute.text("Unmute");
		laserSound.pause();
	} else {
		muteButton.text("Mute");
		endLevelMute.text("Mute");
		laserSound.play();
	}
});
endLevelMute.on("click", function(){
	game.isMuted = !game.isMuted;
	if (game.isMuted) {
		muteButton.text("Unmute");
		endLevelMute.text("Unmute");
		laserSound.pause();
	} else {
		muteButton.text("Mute");
		endLevelMute.text("Mute");
		laserSound.play();
	}
});
nextLevel.on("click", function(event){
	$(this).parent().parent().toggleClass("show-modal", false)
	event.stopPropagation();
	game.accurateShots = 0;
	game.totalShotsLevel = 0;
	game.genLevel();
})
startTurn.on("click", function(event) {
	$(this).parent().parent().toggleClass("show-modal", false)
	game.betweenTurns = !game.betweenTurns;
	// stopAnimatons();

	requestAnimationFrame(animateGame);
	event.stopPropagation();
	game.startTurn();
})
endGameOver.on("click", function(event) {
	game.reset();
})
// ***** FUNCTIONS *****

// switch from game screen to title screen
const returnToTitle = () => {
	const initialPage = "index.html";
	location.replace('https://tboneearls.github.io/space_clones/' + initialPage);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// switch page to title screen
	// display a modal with a message
	// with a button that links to title screen?
}

// function to restore all default stats for both players
// const setDefault = () => {
// 	// this.player1Score = 0;
// 	// this.player1IsDead = false;
// 	// this.accurateShotsPlayer1 = 0;
// 	// this.totalShotsLevelPlayer1 = 0;
// 	// this.player1Lives = 3;

// 	// this.player2Score = 0;
// 	// this.player2IsDead = false;
// 	// this.accurateShotsPlayer2 = 0;
// 	// this.totalShotsLevelPlayer2 = 0;
// 	// this.player2Lives = 3;

// 	// // this.currentLevel = 1;
// 	// this.isPaused = false;
// 	// this.isMuted = false;

// 	// local storage reset
// 	localStorage.setItem("player1lives", "3");
// 	localStorage.setItem("player1score", "0");
// 	localStorage.setItem("player1accshots", "0");
// 	localStorage.setItem("player1totalshots", "0");
// 	localStorage.setItem("enemiesplayer1", "10");
// 	localStorage.setItem("player1mothership", "10");
// 	localStorage.setItem("player1level", "1")

// 	localStorage.setItem("player2lives", "3");
// 	localStorage.setItem("player2score", "0");
// 	localStorage.setItem("player2accshots", "0");
// 	localStorage.setItem("player2totalshots", "0");
// 	localStorage.setItem("enemiesplayer2", "10");
// 	localStorage.setItem("player2mothership", "10");
// 	localStorage.setItem("player2level", "1")
// 	ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

const initMothership = (numShips) => {
	for (let i = 0; i < numShips; i++) {
		mothershipFactory.generateMothership(new Mothership());		
		mothershipFactory.motherships[i].initialize();
	}
}
const initClones = (numClones) => {
	for (let i = 0; i < numClones; i++) {
		cloneFactory.generateClone(new Clone());
		cloneFactory.clones[i].initialize();
	}
}
const round = (value, precision) => {
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}
initClones(initialClones);
$("#enemies-left").text(`Clones: ${initialClones}`);

animateShips();

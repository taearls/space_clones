// ***** GLOBAL VARIABLES *****
const queryString = window.location.search;
const isSolo = (queryString === "?players=1" ? true : false);

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

const initialClones = 10;

const game = {
	highScore: Number(localStorage.getItem("highscore")) > 5000 ? Number(localStorage.getItem("highscore")) : 5000,
	player1Score: Number(localStorage.getItem('player1score')),
	player1Lives: Number(localStorage.getItem('player1lives')),
	player2Score: Number(localStorage.getItem('player2score')),
	player2Lives: Number(localStorage.getItem('player2lives')),
	player1Clones: Number(localStorage.getItem('player1clones')),
	player2Clones: Number(localStorage.getItem('player2clones')),
	player1Mothership: Number(localStorage.getItem('player1mothership')),
	player2Mothership: Number(localStorage.getItem('player2mothership')),
	player1Level: Number(localStorage.getItem('player1level')),
	player2Level: Number(localStorage.getItem('player2level')),
	isSolo: isSolo,
	isPlayer1Turn: true,
	player1IsDead: false,
	player2IsDead: false,
	isPaused: false,
	betweenTurns: false,
	accurateShotsPlayer1: Number(localStorage.getItem('player1accshots')),
	totalShotsPlayer1: Number(localStorage.getItem('player1totalshots')),
	accurateShotsPlayer2: Number(localStorage.getItem('player2accshots')),
	totalShotsPlayer2: Number(localStorage.getItem('player2totalshots')),
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
			requestAnimationFrame(animateShips);
			event.stopPropagation();
		}
	},
	endLevel() {
		laserFactory.lasers = [];
		this.currentLevel++;

		endLevelModal.addClass("show-modal");
		endLevelMessage.text(`You beat Level ${this.currentLevel - 1}!`);
		nextLevel.text(`Begin Level ${this.currentLevel}`);
		if (this.isPlayer1Turn) {
			localStorage.setItem("player1level", this.currentLevel);
			endLevelScore.text(`Player 1 Score: ${this.player1Score}`);
			const percentAcc = Number(this.accurateShotsPlayer1) / Number(this.totalShotsPlayer1) * 100;
			const roundedPercentAcc = round(percentAcc, 1);
			playerAccuracy.text(`Firing Accuracy: ${roundedPercentAcc}%`);
		} else {
			localStorage.setItem("player2level", this.currentLevel);
			endLevelScore.text(`Player 2 Score: ${this.player2Score}`);
			const percentAcc = Number(this.accurateShotsPlayer2) / Number(this.totalShotsPlayer2) * 100;
			const roundedPercentAcc = round(percentAcc, 1);
			playerAccuracy.text(`Firing Accuracy: ${roundedPercentAcc}%`);
		}
	},
	hitMothership() {
		let mothership;
		if (this.isPlayer1Turn) {
			mothership = mothershipFactory.motherships[0];
			mothership.shield--;
			this.player1Mothership = mothership.shield;
			$("#enemies-left").text(`Shield: ${this.player1Mothership}`);
			this.accurateShotsPlayer1++;
			localStorage.setItem("player1accshots", this.accurateShotsPlayer1);
			if (this.player1Mothership <= 0) {
				this.killMothership(mothership);
			}
		} else {
			mothership = mothershipFactory.motherships.length > 1 ? mothershipFactory.motherships[0] : mothershipFactory.motherships[1];
			mothership.shield--;
			localStorage.setItem("player2mothership", mothership.shield);
			$("#enemies-left").text(`Shield: ${this.player2Mothership}`);
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2);
			if (this.player2Mothership <= 0) {
				this.killMothership(mothership);
			}
		}
		
	},
	initMothershipLevel() {
		laserFactory.lasers = [];
		initMothership(1);
		let mothership;
		if (this.isPlayer1Turn) {
			mothership = mothershipFactory.motherships[0];
			$("#enemies-left").text(`Shield: ${this.player1Mothership}`);		
			localStorage.setItem("player1mothership", this.player1Mothership);
		} else {
			mothership = mothershipFactory.motherships.length > 1 ? mothershipFactory.motherships[0] : mothershipFactory.motherships[1];
			$("#enemies-left").text(`Shield: ${this.player2Mothership}`);
			this.player2Mothership = 10;
			localStorage.setItem("player2mothership", this.player1Mothership);
		}
	},
	initClonesLevel() {
		laserFactory.lasers = [];
		$("#level").text(`Level: ${this.currentLevel}`);
		if (this.isPlayer1Turn) {
			this.player1Clones = `${Math.min(Number(initialClones) + this.player1Level * 2, this.maxClones)}`;
			localStorage.setItem("player1clones", this.player1Clones);
			$("#enemies-left").text(`Clones: ${this.player1Clones}`);		
			initClones(this.player1Clones);
		} else {
			this.player2Clones = `${Math.min(Number(initialClones) + this.player2Level * 2, this.maxClones)}`;
			localStorage.setItem("player2clones", this.player2Clones);
			$("#enemies-left").text(`Clones: ${this.player2Clones}`);
			initClones(this.player2Clones);
		}
	},
	killMothership() {
		let mothership;
		if (this.isPlayer1Turn) {
			mothership = mothershipFactory.motherships[0];
			this.player1Score += 1500;
			localStorage.setItem("player1score", this.player1Score);
			$("#player-score").text(`Player 1 Score: ${this.player1Score}`);
		} else {
		 	mothership = mothershipFactory.motherships.length > 1 ? mothershipFactory.motherships[0] : mothershipFactory.motherships[1];
			this.player2Score += 1500;
			localStorage.setItem("player2score", this.player2Score);
			$("#player-score").text(`Player 2 Score: ${this.player2Score}`);
		}

		this.checkHighScore();

		const index = mothershipFactory.motherships.indexOf(mothership);
		mothershipFactory.motherships.splice(index, 1);
		this.bossLevel = false;
		this.endLevel();
	},
	killClone() {
		if (this.isPlayer1Turn) {
			this.player1Clones--;
			$('#enemies-left').text(`Clones: ${this.player1Clones}`);
			localStorage.setItem("player1clones", this.player1Clones);
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

			if (this.player1Clones == 0) {
				$('#enemies-left').text(`Shield: 10`);
				$('#enemies-left').text();
				// $('#enemies-left')[0].innerText = 'Shield: 10';
				this.bossLevel = true;
				this.initMothershipLevel();
			}

		} else {
			this.player2Clones--;
			localStorage.setItem("player2clones", this.player2Clones);
			$('#enemies-left').text(`Clones: ${this.player2Clones}`);
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

			if (this.player2Clones == 0) {
				this.bossLevel = true;

				this.initMothershipLevel();
			}
		}
		
		// set high score updating conditions
		this.checkHighScore();
	},
	checkHighScore() {
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
		localStorage.setItem("player1level", 1);
		localStorage.setItem("player1clones", 10);
		localStorage.setItem("player1mothership", 10);

		localStorage.setItem("player2lives", 3);
		localStorage.setItem("player2score", 0);
		localStorage.setItem("player2accshots", 0);
		localStorage.setItem("player2totalshots", 0);
		localStorage.setItem("player2level", 1);
		localStorage.setItem("player2clones", 10);
		localStorage.setItem("player2mothership", 10);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	die(ship) {
		// if player dies
		if (ship === player1Ship || ship === player2Ship) {
			this.checkGameEnd();
		} else {
			if (!this.bossLevel) { // if a clone dies
				const index = cloneFactory.clones.indexOf(ship);
				cloneFactory.clones.splice(index, 1);
				if (this.isPlayer1Turn) {
					localStorage.setItem("player1clones", `${this.player1Clones - 1}`);
					this.killClone();
				} else {
					localStorage.setItem("player2clones", `${this.player2Clones - 1}`);
					this.killClone();
				}			
			} else {
				this.killMothership();
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
	requestAnimationFrame(animateShips);
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
	game.initClonesLevel();
})
startTurn.on("click", function(event) {
	$(this).parent().parent().toggleClass("show-modal", false)
	game.betweenTurns = !game.betweenTurns;
	// stopAnimatons();

	requestAnimationFrame(animateShips);
	event.stopPropagation();
	game.startTurn();
})
endGameOver.on("click", function(event) {
	game.reset();
})

$(window).on('beforeunload', function() { // restarts game when browser is refreshed
	game.setDefault();
});

// ***** FUNCTIONS *****

const returnToTitle = () => {
	const currentURL = window.location.href;
	const urlWithoutQueryParams = currentURL.split("?")[0];
	const titleScreenURL = urlWithoutQueryParams.replace("game.html", "index.html");

	window.location.replace(titleScreenURL);

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	game.setDefault();
}

const initMothership = () => {
		mothershipFactory.generateMothership(new Mothership());		
		mothershipFactory.motherships[0].initialize();
}

const initClones = (numClones) => {
	for (let i = 0; i < numClones; i++) {
		cloneFactory.generateClone(new Clone());
		cloneFactory.clones[i].initialize();
		// cloneFactory.clones[i].resetValues();
	}
}
const round = (value, precision) => {
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}
initClones(initialClones);

animateShips();

// ***** GLOBAL VARIABLES *****

const myStorage = window.localStorage;

const queryString = window.location.href.split('?')[1];
const isSolo = (queryString === "players=1" ? true : false)

// TITLE SCREEN DISPLAY
if (localStorage.getItem("player1score") == null) {
	$("#player1-score").text("Player 1 Score: 0");
} else {
	$("#player1-score").text("Player 1 Score: " + localStorage.getItem("player1score"));
}

if (localStorage.getItem("player2score") == null) {
	$("#player2-score").text("Player 2 Score: 0");
} else {
	$("#player2-score").text("Player 2 Score: " + localStorage.getItem("player2score"));
}

if (localStorage.getItem("high-score") == null) {
	$("#high--score").text("High Score: 0");
} else {
	$("#high--score").text("High Score: " + localStorage.getItem("high-score"));
}

// EVENT LISTENER VARIABLES

const controls = $("#how-to-play");
const closeControls = $(".close-controls");
const prologue = $("#prologue");
const closePrologue = $(".close-prologue");
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


// instantiate game object
const game = {
	highScore: "5000",
	isSolo: isSolo,
	isPlayer1Turn: true,
	player1Score: "0",
	player1Lives: 3,
	player1IsDead: false,
	player1Items: [],
	player2Score: "0",
	player2Lives: 3,
	player2IsDead: false,
	player2Items: [],
	enemiesRemaining: initialClones,
	player1Clones: 10,
	player2Clones: 10,
	currentLevel: 1,
	isPaused: false,
	betweenTurns: false,
	accurateShotsPlayer1: 0,
	totalShotsLevelPlayer1: 0,
	accurateShotsPlayer2: 0,
	totalShotsLevelPlayer2: 0,
	isMuted: false,
	animation1: true,
	maxClones: 20,
	playerSwitch() {
		let player;
		let otherPlayer;
		console.log("The animation frame closes AFTER I remove the game objects, which throws an error.");
		console.log("VVVV See this right here? VVVV Don't worry about it.");
		if (this.isPlayer1Turn) {
			player = "Player 1";
			otherPlayer = "Player 2";
		} else {
			player = "Player 2";
			otherPlayer = "Player 1";
		}
		this.isPlayer1Turn = !this.isPlayer1Turn;
		this.betweenTurns = !this.betweenTurns;
		
		
		if (this.betweenTurns) {
			playerTurn.text(player + " has died.");
			startTurn.text(otherPlayer + " Start Turn")
			$(".turn-switch-modal").addClass("show-modal");
			stopAnimatons();
		}
		
			// stop animations

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
			$("#level").text("Level: " + localStorage.getItem("player1level"));
			this.currentLevel = localStorage.getItem("player1level");
			$("#player-score").text("Player 1 Score: " + localStorage.getItem("player1score"));
			this.player1Score = localStorage.getItem("player1score");
			$("#lives").text("Player 1 Lives: " + localStorage.getItem("player1lives"));
			this.player1lives = localStorage.getItem("player1Lives");
			$("#turn-start").text("Player 1 Start");
			$("#turn-start").css("animation", "fadeAndScale 1s ease-in forwards");



			// if no clones remaining, display mothership shield instead
			if (localStorage.getItem("enemiesplayer1") === "0") {
				mothershipFactory.motherships = [];
				initMothership(1);
				mothershipFactory.motherships[0].shield = (Number(localStorage.getItem("player1mothership")));
				$("#enemies-left").text("Shield: " + localStorage.getItem("player1mothership"));
			} else {
				mothershipFactory.motherships = [];
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer1"));
				cloneFactory.clones = [];
				initClones(Number(localStorage.getItem("enemiesplayer1")));
			}
		} else {

			// check if 2nd player local storage is empty
			// need to set default local storage for 2nd player the first time
			if (localStorage.getItem("player2level") === null) {
				localStorage.setItem("player2lives", "3");
				localStorage.setItem("player2score", "0");
				localStorage.setItem("player2accshots", "0");
				localStorage.setItem("player2totalshots", "0");
				localStorage.setItem("enemiesplayer2", "10");
				localStorage.setItem("player2mothership", "10");
				localStorage.setItem("player2level", "1")
			}

			this.currentLevel = localStorage.getItem("player2level");
			this.player2Score = localStorage.getItem("player2score");
			this.player2Lives = localStorage.getItem("player2lives");
			$("#level").text("Level: " + localStorage.getItem("player2level"));
			$("#player-score").text("Player 2 Score: " + localStorage.getItem("player2score"));
			$("#lives").text("Player 2 Lives: " + localStorage.getItem("player2lives"));

			$("#turn-start").text("Player 2 Start");
			$("#turn-start").css("animation", "");
			$("#turn-start").css("animation", "fadeAndScale2 1s ease-in forwards");
			if (localStorage.getItem("enemiesplayer2") === "0") {
				mothershipFactory.motherships = [];
				initMothership(1);
				mothershipFactory.motherships[0].shield = (Number(localStorage.getItem("player2mothership")));
				$("#enemies-left").text("Shield: " + localStorage.getItem("player2mothership"));
			} else {
				mothershipFactory.motherships = [];
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer2"));
				cloneFactory.clones = [];
				initClones(Number(localStorage.getItem("enemiesplayer2")));
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
			this.player1Clones = `${Math.min(Number(initialClones) + Number(localStorage.getItem("player1level")) * 1, this.maxClones)}`;
			localStorage.setItem("enemiesplayer1", this.player1Clones.toString());
			$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer1"));
			
			initClones(this.player1Clones);
		} else {
			this.player2Clones = `${Math.min(Number(initialClones) + Number(localStorage.getItem("player2level")) * 1, this.maxClones)}`;
			localStorage.setItem("enemiesplayer2", this.player2Clones.toString());
			$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer2"));
			initClones(this.player2Clones);
		}
		
	},
	endLevel() {
		laserFactory.lasers = [];
		this.currentLevel++;
		$("#level").text("Level: " + this.currentLevel);

		endLevelModal.addClass("show-modal");
		endLevelMessage.text(`You beat Level ${this.currentLevel - 1}!`);
		nextLevel.text("Begin Level " + this.currentLevel);
		if (this.isPlayer1Turn) {
			localStorage.setItem("player1level", this.currentLevel);
			endLevelScore.text("Player 1 Score: " + localStorage.getItem("player1score"));
			let accPercentPlayer1 = Number(localStorage.getItem("player1accshots")) / ((Number(localStorage.getItem("player1totalshots")) + 1) / 2) * 100;
			let roundedAccPlayer1 = round(accPercentPlayer1, 1);
			playerAccuracy.text("Firing Accuracy: " + roundedAccPlayer1 + "%");
		} else {
			localStorage.setItem("player2level", this.currentLevel);
			endLevelScore.text("Player 2 Score: " + localStorage.getItem("player2score"));
			let accPercentPlayer2 = Number(localStorage.getItem("player2accshots")) / ((Number(localStorage.getItem("player2totalshots")) + 1) / 2) * 100;
			let roundedAccPlayer2 = round(accPercentPlayer2, 1);
			playerAccuracy.text("Firing Accuracy: " + roundedAccPlayer2 + "%");
		}
	},
	initMothership() {
		laserFactory.lasers = [];
		initMothership(1);
		// cancelAnimationFrame(cancelMe4)
		// requestAnimationFrame(animateMothership);
		$("#enemies-left").text("Shield: 10")
	},
	hitMothership(mothership) {
		if (this.isPlayer1Turn) {
			mothership.shield--;
			localStorage.setItem("player1mothership", mothership.shield.toString());
			$("#enemies-left").text("Shield: " + localStorage.getItem("player1mothership"));
			this.accurateShotsPlayer1++;
			localStorage.setItem("player1accshots", this.accurateShotsPlayer1.toString());
		} else {
			mothership.shield--;
			localStorage.setItem("player2mothership", mothership.shield.toString());
			$("#enemies-left").text("Shield: " + localStorage.getItem("player2mothership"));
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2.toString());
		}
		if (mothership.shield <= 0) {
			this.killMothership(mothership);
		}
	},
	killMothership(mothership) {
		if (this.isPlayer1Turn) {
			this.player1Score = `${Number(this.player1Score) + 1500}`;
			localStorage.setItem("player1score", this.player1Score.toString());
			$("#player-score").text("Player 1 Score: " + localStorage.getItem("player1score").toString());
		} else {
			this.player2Score = `${Number(this.player2Score) + 1500}`;
			localStorage.setItem("player2score", this.player2Score.toString());
			$("#player-score").text("Player 2 Score: " + localStorage.getItem("player2score").toString());
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
		let highScore;
		if (this.isPlayer1Turn) {
			this.player1Clones--;
			localStorage.setItem("enemiesplayer1", this.player1Clones);
			this.accurateShotsPlayer1++;
			localStorage.setItem("player1accshots", this.accurateShotsPlayer1.toString());

			this.player1Score = `${Number(this.player1Score) + 100}`;
			localStorage.setItem("player1score", this.player1Score.toString());

			if (this.player1Score === "9000" || this.player1Score === "15000" || this.player1Score === "22000") {
				this.player1Lives++;
				localStorage.setItem("player1lives", this.player1Lives.toString());
				$("#lives").text("Player 1 Lives: " + localStorage.getItem("player1lives"));
				if (this.animation1) {
					$("#extra-life").css("animation", "extraLives 1s ease-in forwards");
					this.animation1 = false;
				} else {
					$("#extra-life").css("animation", "extraLives2 1s ease-in forwards");
					this.animation1 = true;
				}
			}
			$("#player-score").text("Player 1 Score: " + localStorage.getItem("player1score"));

		} else {
			this.player2Clones--;
			localStorage.setItem("enemiesplayer2", this.player2Clones);
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2.toString());

			this.player2Score = `${Number(this.player2Score) + 100}`;
			localStorage.setItem("player2score", this.player2Score.toString());

			if (this.player2Score === "9000" || this.player2Score === "15000" || this.player2Score === "22000") {
				this.player2Lives++;
				localStorage.setItem("player2lives", this.player2Lives.toString());
				$("#lives").text("Player 2 Lives: " + localStorage.getItem("player2lives"));
				if (this.animation1) {
					$("#extra-life").css("animation", "extraLives 1s ease-in forwards");
					this.animation1 = false;
				} else {
					$("#extra-life").css("animation", "extraLives2 1s ease-in forwards");
					this.animation1 = true;
				}
			}
			$("#player-score").text("Player 2 Score: " + localStorage.getItem("player2score"));
		}
		
		// set high score updating conditions
		if (Number(localStorage.getItem("player1score")) > Number(localStorage.getItem("player2score")) && Number(localStorage.getItem("player1score")) > Number(localStorage.getItem("highscore"))) {
			this.highScore = this.player1Score;
			localStorage.setItem("highscore", this.highScore.toString());
			document.getElementById("high-score").innerHTML = ("High Score: " + localStorage.getItem("highscore"));
		} else if (Number(localStorage.getItem("player2score")) > Number(localStorage.getItem("player1score")) && Number(localStorage.getItem("player2score")) > Number(localStorage.getItem("highscore"))) {
			this.highScore = this.player2Score;
			localStorage.setItem("highscore", this.highScore.toString());
			document.getElementById("high-score").innerHTML = ("High Score: " + localStorage.getItem("highscore"));
		}
	},
	reset() {
		// restore all values to default
		// return to title screen
		setDefault();
		returnToTitle();
		dispHighScore(localStorage.getItem("highscore"));
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
				localStorage.setItem("enemiesplayer1", `${Number(localStorage.getItem("enemiesplayer1")) - 1}`);
				this.score();
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer1"));
				if (localStorage.getItem("enemiesplayer1") === "0") {
					this.initMothership();
				}
			} else {
				localStorage.setItem("enemiesplayer2", `${Number(localStorage.getItem("enemiesplayer2")) - 1}`);
				this.score();
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer2"));
				if (localStorage.getItem("enemiesplayer2") === "0") {
					this.initMothership();
				}
			}
		}
	},
	checkGameEnd() {
		// game end message
		// return to title screen
		// set conditions for one player vs two players
		if (this.isSolo) {
			this.player1Lives--;
			localStorage.setItem("player1lives", this.player1Lives.toString());
			if (!this.player1IsDead) {
				// so lives don't keep going down
				$("#lives").text("Player 1 Lives: " + localStorage.getItem("player1lives"));
				if (localStorage.getItem("player1lives") === "0") {
					this.player1IsDead = true;
					console.log("The animation frame closes AFTER I remove the game objects, which throws an error.");
					console.log("VVVV See this right here? VVVV Don't worry about it.");
					this.gameOver();
				}
			}
			// game end message
			// return to title screen
		} else {
			// call switch turn / turn start methods here
			if (this.isPlayer1Turn) {
				this.player1Lives--;
				localStorage.setItem("player1lives", this.player1Lives.toString());
				if (!this.player1IsDead) {
					$("#lives").text("Player 1 Lives: " + localStorage.getItem("player1lives"));
				}
				if (localStorage.getItem("player1lives") === "0" && !this.player1IsDead) {
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
				localStorage.setItem("player2lives", this.player2Lives.toString());
				if (!this.player2IsDead) {
					$("#lives").text("Player 2 Lives: " + localStorage.getItem("player2lives"));
				}

				if (localStorage.getItem("player2lives") === "0" && !this.player2IsDead) {
					this.player2IsDead = true;
					if (this.player2IsDead && this.player1IsDead) {
						this.gameOver();
					} else if (this.player1IsDead === false) {
						this.playerSwitch();
					}
				} else if (!this.player1IsDead) {
					this.playerSwitch();
				}
			}
		}
	},
	gameOver() {
		$("#game-over-message").css("font-size", "40px");
		gameOverModal.addClass("show-modal");
		stopAnimatons();
	}
}




//  ***** MODALS *****

controls.on("click", function(event) {
	$(".controls-modal").addClass("show-modal");
});

closeControls.on("click", function(event) {
	$(this).parent().parent().toggleClass("show-modal", false);
	event.stopPropagation();
});

prologue.on("click", function(event) {
	$(".prologue-modal").addClass("show-modal");
});

closePrologue.on("click", function(event) {
	$(this).parent().parent().toggleClass("show-modal", false)
	event.stopPropagation();
});

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
const setDefault = () => {
	this.player1Score = 0;
	this.player1IsDead = false;
	this.accurateShotsPlayer1 = 0;
	this.totalShotsLevelPlayer1 = 0;
	this.player1Lives = 3;

	this.player2Score = 0;
	this.player2IsDead = false;
	this.accurateShotsPlayer2 = 0;
	this.totalShotsLevelPlayer2 = 0;
	this.player2Lives = 3;

	this.currentLevel = 1;
	this.isPaused = false;
	this.isMuted = false;

	// local storage reset
	localStorage.setItem("player1lives", "3");
	localStorage.setItem("player1score", "0");
	localStorage.setItem("player1accshots", "0");
	localStorage.setItem("player1totalshots", "0");
	localStorage.setItem("enemiesplayer1", "10");
	localStorage.setItem("player1mothership", "10");
	localStorage.setItem("player1level", "1")

	localStorage.setItem("player2lives", "3");
	localStorage.setItem("player2score", "0");
	localStorage.setItem("player2accshots", "0");
	localStorage.setItem("player2totalshots", "0");
	localStorage.setItem("enemiesplayer2", "10");
	localStorage.setItem("player2mothership", "10");
	localStorage.setItem("player2level", "1")
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

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
$("#enemies-left").text("Clones: " + initialClones);

const restartAnimation = () => {
	const element = $("h1")[0];

	// remove run animation class
  element.classList.remove("run-animation");
  
  // trigger reflow
	void element.offsetWidth;
  
	// re-add the run animation class
	element.classList.add("run-animation");
}

const removeKeys = () => {
	document.removeEventListener("keydown", addKeys());
}
const stopAnimatons = () => {
	cloneFactory.clones = [];
	mothershipFactory.motherships = [];
	cancelAnimationFrame(cancelMe);
}

animateGame();


// ***** GLOBAL VARIABLES *****

myStorage = window.localStorage;

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
const onePlayerGame = $("#solo");
const twoPlayerGame = $("#co-op");
let amountClones = 10;

// instantiate game object
const game = {
	highScore: 5000,
	// switch to false if 2 player mode selected
	isSolo: true,
	isPlayer1Turn: true,
	player1Score: 0,
	player1Lives: 3,
	player1IsDead: false,
	player1Items: [],
	player2Score: 0,
	player2Lives: 3,
	player2IsDead: false,
	player2Items: [],
	enemiesRemaining: amountClones,
	currentLevel: 1,
	isPaused: false,
	accurateShotsPlayer1: 0,
	totalShotsLevelPlayer1: 0,
	accurateShotsPlayer2: 0,
	totalShotsLevelPlayer2: 0,
	isMuted: false,
	playerSwitch() {
		this.isPlayer1Turn = !this.isPlayer1Turn;
		this.startTurn();
	},
	startTurn() {
		// display player 1 start or player 2 start
		// switch all stats displayed // affected
		if (this.isPlayer1Turn) {
			$("#player-score").text("Score: " + localStorage.getItem("player1score"));
			$("#lives").text("Lives: " + localStorage.getItem("player1lives"));
			$("#turn-start").text("Player 1 Start");
			$("#turn-start").css("animation", "fadeAndScale 1s ease-in forwards");
		} else {
			$("#player-score").text("Score: " + localStorage.getItem("player2score"));
			$("#lives").text("Lives: " + localStorage.getItem("player2lives"));
			$("#turn-start").text("Player 2 Start");
			$("#turn-start").css("animation", "fadeAndScale 1s ease-in forwards");
		}
		// reboot level where progress was made
	},
	pause() {
		this.isPaused = !this.isPaused;
		if (this.isPaused) {
			$(".pause-modal").addClass("show-modal");
			// stop animations
			cancelAnimationFrame(cancelMe1);
			cancelAnimationFrame(cancelMe2);
			cancelAnimationFrame(cancelMe3);
			cancelAnimationFrame(cancelMe4);
					
		} else {
			$(".pause-modal").toggleClass("show-modal", false)
			this.isPaused = false;
			// resume animations
			requestAnimationFrame(animatePlayer);
			requestAnimationFrame(animateClone);
			requestAnimationFrame(animatePlayerFire);
			requestAnimationFrame(animateMothership);
			event.stopPropagation();
		}
	},
	genLevel() {
		// instantiate new ships and a mothership
		// for loop to increment amount of ships + enemy stats?
		amountClones = amountClones + (this.currentLevel * 1);
		this.enemiesRemaining = amountClones;
		$("#enemies-left").text("Clones: " + this.enemiesRemaining);
		initClones(amountClones);
	},
	endLevel() {
		this.currentLevel++;
		$("#level").text("Level: " + this.currentLevel);
		for (let i = 0; i < player1Ship.shotsFired.length; i++) {
			player1Ship.shotsFired[i].disappear(player1Ship, player1Ship.shotsFired[i]);
		}
		for (let i = 0; i < player2Ship.shotsFired.length; i++) {
			player2Ship.shotsFired[i].disappear(player2Ship, player2Ship.shotsFired[i]);
		}
		// display message
		// firing accuracy
		// end bonus points?
		endLevelModal.addClass("show-modal");
		endLevelMessage.text("You beat Level " + `${this.currentLevel - 1}` + "!");
		nextLevel.text("Begin Level " + this.currentLevel);
		if (this.isPlayer1Turn) {
			endLevelScore.text("Score: " + localStorage.getItem("player1score"));
			let accPercentPlayer1 = Number(localStorage.getItem("player1accshots")) / Number(localStorage.getItem("player1totalshots")) * 100;
			let roundedAccPlayer1 = round(accPercentPlayer1, 1);
			playerAccuracy.text("Firing Accuracy: " + roundedAccPlayer1 + "%");
		} else {
			endLevelScore.text("Score: " + localStorage.getItem("player2score"));
			let accPercentPlayer2 = Number(localStorage.getItem("player2accshots")) / Number(localStorage.getItem("player2totalshots")) * 100;
			let roundedAccPlayer2 = round(accPercentPlayer2, 1);
			playerAccuracy.text("Firing Accuracy: " + roundedAccPlayer2 + "%");
		}
	},
	initMothership() {
		initMothership(1);
		$("#enemies-left").text("Shield: 10")
	},
	hitMothership(mothership) {
		mothership.shield--;

		$("#enemies-left").text("Shield: " + mothership.shield);
		if (this.isPlayer1Turn) {
			this.accurateShotsPlayer1++;
			localStorage.setItem("player1accshots", this.accurateShotsPlayer1.toString());
		} else {
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2.toString());
		}
		if (mothership.shield <= 0) {
			this.killMothership(mothership);
		}
	},
	killMothership(mothership) {
		if (this.isPlayer1Turn) {
			this.player1Score += 1500;
			localStorage.setItem("player1score", this.player1Score.toString());
			$("#player-score").text("Score: " + localStorage.getItem("player1score").toString());
		} else {
			this.player2Score += 1500;
			localStorage.setItem("player2score", this.player2score.toString());
			$("#player-score").text("Score: " + localStorage.getItem("player2score").toString());
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

			this.accurateShotsPlayer1++;
			localStorage.setItem("player1accshots", this.accurateShotsPlayer1.toString());

			this.player1Score += 100;
			localStorage.setItem("player1score", this.player1Score.toString());

			if (this.player1Score === 10000 || this.player1Score === 20000 || this.player1Score === 30000) {
				this.player1Lives++;
				localStorage.setItem("player1lives", this.player1Lives.toString());
				$("#lives").text("Lives: " + localStorage.getItem("player1lives"));
				$("#extra-life").css("animation", "fadeAndScale2Hidden 1s ease-in forwards");
			}
			$("#player-score").text("Score: " + localStorage.getItem("player1score"));

		} else {
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2.toString());

			this.player2Score += 100;
			localStorage.setItem("player2score", this.player2score.toString());

			if (this.player2Score === 10000 || this.player2Score === 20000 || this.player2Score === 30000) {
				this.player2Lives++;
				localStorage.setItem("player2lives", this.player2Lives.toString());
				$("#lives").text("Lives: " + localStorage.getItem("player2lives"));
				$("#extra-life").css("animation", "fadeAndScale2Hidden 1s ease-in forwards");
			}
			$("#player-score").text("Score: " + localStorage.getItem("player2score"));
		}
		
		// set high score updating conditions
		if (this.player1Score > this.player2Score && this.player1Score > this.highScore) {
			this.highScore = this.player1Score;
			localStorage.setItem("highscore", this.highScore.toString());
			document.getElementById("high-score").innerHTML = ("High Score: " + localStorage.getItem("highscore"));
		} else if (this.player2Score > this.player1Score && this.player2Score > this.highScore) {
			this.highScore = this.player2Score;
			localStorage.setItem("highscore", this.highScore.toString());
			document.getElementById("high-score").innerHTML = ("High Score: " + localStorage.getItem("highscore"));
		}
	},
	win() {
		console.log("you win!")
		// victory message with concluding story text
		// animation depicting end
		// display player score, accuracy
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
			this.gameOver();
		} else {
			// if a clone dies
			if (this.isPlayer1Turn) {
				const index = cloneFactory.clones.indexOf(ship);
				cloneFactory.clones.splice(index, 1);
				this.enemiesRemaining--;
				localStorage.setItem("enemiesplayer1", this.enemiesRemaining.toString());
				this.score();
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer1"));
				if (localStorage.getItem("enemiesplayer1") === 0) {
					this.initMothership();
				}
			} else {
				const index = cloneFactory.clones.indexOf(ship);
				cloneFactory.clones.splice(index, 1);
				this.enemiesRemaining--;
				localStorage.setItem("enemiesplayer2", this.enemiesRemaining.toString());
				this.score();
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer2"));
				if (localStorage.getItem("enemiesplayer2") === 0) {
					this.initMothership();
				}
			}
		}
	},
	gameOver() {
		// game end message
		// return to title screen
		// set conditions for one player vs two players
		if (this.isSolo) {
			this.player1Lives--;
			localStorage.set("player1lives", this.player1Lives.toString());
			$("#lives").text("Lives: " + localStorage.get("player1lives"));
			if (this.player1Lives === 0) {
				setDefault();
				returnToTitle();
			}
			// game end message
			// return to title screen
		} else {
			// call switch turn / turn start methods here
			if (this.player1Lives === 0 && !this.player1IsDead) {
				this.player1IsDead = true;
				// game end message
			} else if (this.player2Lives === 0 && !this.player2IsDead) {
				this.player2IsDead = true;
			} else if (this.player1IsDead && this.player2IsDead) {
				setDefault();
				returnToTitle();
			} else if (this.isPlayer1Turn) {
				this.player1Lives--;
				localStorage.set("player1lives", this.player1Lives.toString());
				$("#lives").text("Lives: " + localStorage.get("player1lives"));
				if (!this.player2IsDead) {
					this.playerSwitch();
				}
			} else if (!this.isPlayer1Turn) {
				this.player2Lives--;
				localStorage.set("player2lives", this.player2Lives.toString());
				$("#lives").text("Lives: " + localStorage.get("player2lives"));
				if (!this.player1IsDead) {
					this.playerSwitch();
				}
			}
			// set conditions for both players
		}
	}

}


// ***** BUTTONS *****

$("#solo").on("click", function(event) {
	game.isSolo = true;
	game.newGame();
});
$("#co-op").on("click", function(event) {
	game.isSolo = false;
	game.newGame();
});

//  ***** MODALS *****

controls.on("click", function(event){
	$(".controls-modal").addClass("show-modal")
})

closeControls.on("click", function(event) {
	$(this).parent().parent().toggleClass("show-modal", false)
	event.stopPropagation();
})

prologue.on("click", function(event){
	$(".prologue-modal").addClass("show-modal");
})

closePrologue.on("click", function(event) {
	$(this).parent().parent().toggleClass("show-modal", false)
	event.stopPropagation();
})
closePause.on("click", function(event){
	$(this).parent().parent().toggleClass("show-modal", false)
	game.isPaused = false;
	requestAnimationFrame(animatePlayer);
	requestAnimationFrame(animateClone);
	requestAnimationFrame(animatePlayerFire);
	requestAnimationFrame(animateMothership);
	event.stopPropagation();
})
resetGame.on("click", function(event) {
	game.reset();
})
endLevelReset.on("click", function(event){
	game.reset();
})
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
twoPlayerGame.on("click", function(event){
	game.isSolo = false;
})
// ***** FUNCTIONS *****

// switch from game screen to title screen
const returnToTitle = () => {
	const initialPage = "title_screen.html";
	location.replace('file:///Users/tboneearls/turtles/wdi_project_1/space_clones/' + initialPage);
	ctx2.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	// switch page to title screen
	// display a modal with a message
	// with a button that links to title screen?
}

// function to restore all default stats for both players
const setDefault = () => {
	$("#player-score").text("Player Score: 0");
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

	$("#lives").text("Lives: 3")
	$("#level").text("Level: 1")
	this.currentLevel = 1;
	this.isPaused = false;
	this.isMuted = false;
	ctx2.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
}

const initMothership = (numShips) => {
	for (let i = 0; i < numShips; i++) {
		mothershipFactory.generateMothership(new Mothership());		
		mothershipFactory.motherships[i].initialize();
	}
}
const initClones = (numClones) => {
	for (let i = 0; i < amountClones; i++) {
	cloneFactory.generateClone(new Clone());
	cloneFactory.clones[i].initialize();
	}
}
const round = (value, precision) => {
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}
initClones(amountClones);
$("#enemies-left").text("Enemies: " + amountClones);

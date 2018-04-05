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
	// infinite levels? idk
	enemiesRemaining: amountClones,
	currentLevel: 1,
	isPaused: false,
	accurateShots: 0,
	totalShotsLevel: 0,
	isMuted: false,
	newGame() {
		// load prologue
		// level 1
		// player stats default
		// score 0
	},
	playerSwitch() {
		// switch all stats displayed // affected
		// catch if both players are dead
	},
	startTurn() {
		// reboot level where progress was made
		// display player1 start or player 2 start
	},
	pause() {
		this.isPaused = !this.isPaused;
		if (this.isPaused) {
			$(".pause-modal").addClass("show-modal");
			cancelAnimationFrame(cancelMe1);
			cancelAnimationFrame(cancelMe2);
			cancelAnimationFrame(cancelMe3);
			cancelAnimationFrame(cancelMe4);
					
		} else {
			$(".pause-modal").toggleClass("show-modal", false)
			this.isPaused = false;
			requestAnimationFrame(animatePlayer);
			requestAnimationFrame(animateClone);
			requestAnimationFrame(animatePlayerFire);
			requestAnimationFrame(animateMothership);
			event.stopPropagation();
			
			// resume animation
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
		endLevelScore.text("Score: " + this.player1Score);
		let accPercent = (this.accurateShots / this.totalShotsLevel) * 100;
		let roundedAcc = round(accPercent, 1);
		playerAccuracy.text("Firing Accuracy: " + roundedAcc + "%");
		nextLevel.text("Begin Level " + this.currentLevel);
	},
	initMothership() {
		initMothership(1);
		$("#enemies-left").text("Shield: 10")
	},
	killMothership(mothership) {
		this.accurateShots++;
		if (this.isPlayer1Turn) {
			this.player1Score += 1500;
			$("#player-score").text("Score: " + this.player1Score);
		} else {
			this.player2Score += 1500;
			$("#player-score").text("Score: " + this.player2Score);
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
			this.accurateShots++;
			this.player1Score += 100;
			$("#player-score").text("Score: " + this.player1Score);
		} else {
			this.player2Score += 100;
			$("#player-score").text("Score: " + this.player2Score);
		}
		// for each base enemy, 100 points
		// mothership, 1000 points
		// extra life conditions could go here eventually
		
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
		if (ship === player1Ship || ship === player2Ship) {
			this.gameOver();
		} else {
			const index = cloneFactory.clones.indexOf(ship);
			cloneFactory.clones.splice(index, 1);
			this.accurateShots++;
			this.enemiesRemaining--;
			this.score();
			$("#enemies-left").text("Clones: " + this.enemiesRemaining);
			if (this.enemiesRemaining === 0) {
				this.initMothership();
			}
		}
	},
	gameOver() {
		// game end message
		// return to title screen
		// set conditions for one player vs two players
		if (this.isSolo) {
			this.player1Lives--;
			$("#lives").text("Lives: " + this.player1Lives);
			if (this.player1Lives === 0) {
				setDefault();
				returnToTitle();
			}
			// game end message
			// return to title screen
		} else {
			if (this.player1Lives === 0 && !this.player1IsDead) {
				this.player1IsDead = true;
				// game end message
			} else if (this.player2Lives === 0 && !this.player2IsDead) {
				this.player2IsDead = true;
			} else if (this.player1IsDead && this.player2IsDead) {
				setDefault();
				returnToTitle();
			} else if (isPlayer1Turn) {
				this.player1Lives--;
			} else if (!isPlayer1Turn) {
				this.player2Lives--;
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
nextLevel.on("click", function(){
	$(this).parent().parent().toggleClass("show-modal", false)
	event.stopPropagation();
	game.accurateShots = 0;
	game.totalShotsLevel = 0;
	game.genLevel();
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
	this.player2Score = 0;
	this.player1IsDead = false;
	this.player2IsDead = false;
	$("#lives").text("Lives: 3")
	this.player1Lives = 3;
	this.player2Lives = 3;
	$("#level").text("Level: 1")
	this.currentLevel = 1;
	this.isPaused = false;
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

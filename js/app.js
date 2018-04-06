// ***** GLOBAL VARIABLES *****

myStorage = window.localStorage;
const url = window.location.href;
const getQuery = url.split('?')[1];
const isSolo = (getQuery === "players=1"? true : false)
// use .split type thing to get the player=2 part of the URL
// then use split type thing again to get the string after the =


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
// const onePlayerGame = $("#solo");
// const twoPlayerGame = $("#two");
let initialClones = 10;


// instantiate game object
const game = {
	highScore: "5000",
	// switch to false if 2 player mode selected
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
	accurateShotsPlayer1: 0,
	totalShotsLevelPlayer1: 0,
	accurateShotsPlayer2: 0,
	totalShotsLevelPlayer2: 0,
	isMuted: false,
	playerSwitch() {
		cloneFactory.clones = [];
		mothershipFactory.motherships = [];
		// cancelAnimationFrame(cancelMe2);
		// cancelAnimationFrame(cancelMe4);
		ctx2.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
		this.isPlayer1Turn = !this.isPlayer1Turn;
		this.startTurn();
	},
	startTurn() {
		// display player 1 start or player 2 start
		// switch all stats displayed // affected
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
				initMothership(1);
				mothershipFactory.motherships[0].shield = (Number(localStorage.getItem("player1mothership")));
				$("#enemies-left").text("Shield: " + localStorage.getItem("player1mothership"));
			} else {
				mothershipFactory.motherships = [];
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer1"));
				cloneFactory.clones = [];
				initClones(Number(localStorage.getItem("enemiesplayer1")));
				// cancelAnimationFrame(cancelMe3);
				// requestAnimationFrame(animateClone);
			}
		} else {
			this.currentLevel = localStorage.getItem("player2level");
			this.player2Score = localStorage.getItem("player2score");
			this.player2Lives = localStorage.getItem("player2lives");
			$("#level").text("Level: " + localStorage.getItem("player2level"));
			$("#player-score").text("Player 2 Score: " + localStorage.getItem("player2score"));
			$("#lives").text("Player 2 Lives: " + localStorage.getItem("player2lives"));

			$("#turn-start").text("Player 2 Start");
			$("#turn-start").css("animation", "fadeAndScale 1s ease-in forwards");
			if (localStorage.getItem("enemiesplayer2") === "0") {
				initMothership(1);
				mothershipFactory.motherships[0].shield = (Number(localStorage.getItem("player2mothership")));
				$("#enemies-left").text("Shield: " + localStorage.getItem("player2mothership"));
			} else {
				mothershipFactory.motherships = [];
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer2"));
				cloneFactory.clones = [];
				// cancelAnimationFrame(cancelMe3);
				initClones(Number(localStorage.getItem("enemiesplayer2")));
				// cancelAnimationFrame(cancelMe3);
				// requestAnimationFrame(animateClone);
			}
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
		if (this.isPlayer1Turn) {
			this.player1Clones = `${Number(initialClones) + Number(localStorage.getItem("player1level")) * 1}`;
			localStorage.setItem("enemiesplayer1", this.player1Clones.toString());
			$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer1"));
			// cancelAnimationFrame(cancelMe3);
			// requestAnimationFrame(animateClone);
			initClones(this.player1Clones);
			cancelAnimationFrame(cancelMe3);
			requestAnimationFrame(animateClone);
		} else {
			this.player2Clones = `${Number(initialClones) + Number(localStorage.getItem("player2level")) * 1}`;
			localStorage.setItem("enemiesplayer2", this.player2Clones.toString());
			$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer2"));
		
			initClones(this.player2Clones);
			cancelAnimationFrame(cancelMe3);
			requestAnimationFrame(animateClone);
		}
		
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
		initMothership(1);
		cancelAnimationFrame(cancelMe4)
		requestAnimationFrame(animateMothership);
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

			if (this.player1Score === "10000" || this.player1Score === "25000" || this.player1Score === "40000") {
				this.player1Lives++;
				localStorage.setItem("player1lives", this.player1Lives.toString());
				$("#lives").text("Player 1 Lives: " + localStorage.getItem("player1lives"));
				$("#extra-life").css("animation", "fadeAndScale2Hidden 1s ease-in forwards");
			}
			$("#player-score").text("Player 1 Score: " + localStorage.getItem("player1score"));

		} else {
			this.player2Clones--;
			localStorage.setItem("enemiesplayer2", this.player2Clones);
			this.accurateShotsPlayer2++;
			localStorage.setItem("player2accshots", this.accurateShotsPlayer2.toString());

			this.player2Score = `${Number(this.player2Score) + 100}`;
			localStorage.setItem("player2score", this.player2Score.toString());

			if (this.player2Score === "10000" || this.player2Score === "25000" || this.player2Score === "40000") {
				this.player2Lives++;
				localStorage.setItem("player2lives", this.player2Lives.toString());
				$("#lives").text("Player 2 Lives: " + localStorage.getItem("player2lives"));
				$("#extra-life").css("animation", "fadeAndScale2Hidden 1s ease-in forwards");
			}
			$("#player-score").text("Player 2 Score: " + localStorage.getItem("player2score"));
		}
		
		// set high score updating conditions
		if (Number(localStorage.getItem("player1score")) > Number(localStorage.getItem("player2score")) && Number(localStorage.getItem("player1score")) > Number(this.highScore)) {
			this.highScore = this.player1Score;
			localStorage.setItem("highscore", this.highScore.toString());
			document.getElementById("high-score").innerHTML = ("High Score: " + localStorage.getItem("highscore"));
		} else if (Number(localStorage.getItem("player2score")) > Number(localStorage.getItem("player1score")) && Number(localStorage.getItem("player2score")) > Number(this.highScore)) {
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
		if (ship === player1Ship) {
			this.gameOver();
		} else if (ship === player2Ship) {
			this.gameOver();
		} else {
			// if a clone dies
			if (this.isPlayer1Turn) {
				const index = cloneFactory.clones.indexOf(ship);
				cloneFactory.clones.splice(index, 1);
				localStorage.setItem("enemiesplayer1", `${Number(localStorage.getItem("enemiesplayer1")) - 1}`);
				this.score();
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer1"));
				if (localStorage.getItem("enemiesplayer1") === "0") {
					this.initMothership();
				}
			} else {
				const index = cloneFactory.clones.indexOf(ship);
				cloneFactory.clones.splice(index, 1);
				localStorage.setItem("enemiesplayer2", `${Number(localStorage.getItem("enemiesplayer2")) - 1}`);
				this.score();
				$("#enemies-left").text("Clones: " + localStorage.getItem("enemiesplayer2"));
				if (localStorage.getItem("enemiesplayer2") === "0") {
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
			localStorage.setItem("player1lives", this.player1Lives.toString());
			$("#lives").text("Player 1 Lives: " + localStorage.getItem("player1lives"));
			if (localStorage.getItem("player1lives")=== "0") {
				setDefault();
				returnToTitle();
			}
			// game end message
			// return to title screen
		} else {
			// call switch turn / turn start methods here
			if (this.isPlayer1Turn) {
				this.player1Lives--;
				localStorage.setItem("player1lives", this.player1Lives.toString());
				$("#lives").text("Player 1 Lives: " + localStorage.getItem("player1lives"));
				
				if (localStorage.getItem("player1lives") === "0" && !this.player1IsDead) {
					this.player1IsDead = true;
					if (this.player1IsDead && this.player2IsDead) {
						setDefault();
						returnToTitle();
					} else if (this.player2IsDead === false) {
						this.playerSwitch();
					}
				} else {
					this.playerSwitch();
				}
			} else if (!this.isPlayer1Turn) {
				this.player2Lives--;
				localStorage.setItem("player2lives", this.player2Lives.toString());
				$("#lives").text("Player 2 Lives: " + localStorage.getItem("player2lives"));

				if (localStorage.getItem("player1lives") === "0" && !this.player2IsDead) {
					this.player2IsDead = true;
					if (this.player2IsDead && this.player1IsDead) {
						setDefault();
						returnToTitle();
					} else if (this.player1IsDead === false) {
						this.playerSwitch();
					}
				} else {
					this.playerSwitch();
				}
			}
			// set conditions for both players
		}
	}

}




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
	ctx2.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
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

// window.onbeforeunload = function (event) {

// 	game.reset();
// }

animatePlayer();
animatePlayerFire();
animateClone();
animateMothership();


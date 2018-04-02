// ***** GLOBAL VARIABLES *****




const controls = $("#how-to-play");
const closeControls = $(".close-controls");
const prologue = $("#prologue");
const closePrologue = $(".close-prologue");

// instantiate game object

const game = {
	highScore: 20000,
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
	amountLevels: 5,
	enemiesRemaining: 0,
	currentLevel: 1,
	isPaused: false,
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
			// stop animation
			// display modal
		} else {
			// close modal
			// resume animation
		}
		// modal pop up
		// display stats
		// option to quit
		// all game level animations freeze in place
		// display controls
	},
	genLevel() {
		// instantiate new ships and a mothership
		// for loop to increment amount of ships + enemy stats?
		for (let i = 0; i < this.amountLevels; i++) {
			// this.currentLevel times stats = base enemy stats

		}
	},
	endLevel() {
		currentLevel++;
		// display message
		// firing accuracy
		// end bonus points?
		genLevel();
	},
	score() {
		// set player score updating conditions first
		// for each base enemy, 100 points
		// mothership, 1000 points
		// extra life conditions could go here eventually
		
		// set high score updating conditions
		if (this.player1Score > this.player2Score && this.player1Score > this.highScore) {
			this.highScore = this.player1Score;
		} else if (his.player2Score > this.player1Score && this.player2Score > this.highScore) {
			this.highScore = this.player2Score;
		}
	},
	win() {
		// victory message with concluding story text
		// animation depicting end
		// display player score, accuracy
	},
	reset() {
		// restore all values to default
		// return to title screen
		setDefault();
		returnToTitle();
	},
	gameOver() {
		// game end message
		// return to title screen
		// set conditions for one player vs two players
		if (this.isSolo) {
			setDefault();
			returnToTitle();
			// game end message
			// return to title screen
		} else {
			if (this.player1Lives === 0) {
				this.player1IsDead = true;
				// game end message
			} else if (this.player2Lives === 0) {
				this.player2IsDead = true;
			} else if (this.player1IsDead && this.player2IsDead) {
				setDefault();
				returnToTitle();
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
	$(this).parent().parent().toggleClass('show-modal', false)
	event.stopPropagation();
})

prologue.on("click", function(event){
	$(".prologue-modal").addClass("show-modal");
})

closePrologue.on("click", function(event) {
	$(this).parent().parent().toggleClass('show-modal', false)
	event.stopPropagation();
})


// ***** FUNCTIONS *****

// switch from game screen to title screen
const returnToTitle = () => {
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
} 

// write a function to get the distance between two objects in the canvas
const getDistance = (x1, y1, x2, y2) => {
	// store dist between x and y coords in a variable
	let xDistance = x2 - x1;
	let yDistance = y2 - y1;
	// use pythagoreon theorum to calc distance
	return Math.sqrt(xDistance ** 2 + yDistance ** 2);
}





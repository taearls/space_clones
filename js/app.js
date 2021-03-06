// ***** GLOBAL VARIABLES *****
const queryString = window.location.search;
const isSolo = (queryString === "?players=1" ? true : false);
const onProduction = window.location.protocol !== "file:"; 

// EVENT LISTENER VARIABLES

const $resetButton = $(".reset-button");
const $playerAccuracy = $(".player-accuracy");

// Pause Modal
const $pauseModal = $(".pause-modal");
const $pauseClose = $(".close-pause");
const $pauseMute = $("#mute-button");

// End of Level Modal
const $endOfLevelModal = $(".end-level-modal");
const $endOfLevelMessage = $("#end-level-message");
const $endOfLevelNextLevelButton = $(".next-level");
const $endOfLevelScore = $("#end-level-score");
const $endOfLevelMute = $("#end-level-mute");
const $endOfLevelReset = $("#end-level-reset");

// Switch Turn Modal
const $endOfTurnModal = $(".turn-switch-modal");
const $endOfTurnText = $("#player-turn");
const $endOfTurnStartTurn = $(".start-turn");

// Game over Modal
const $gameOverModal = $(".game-over-modal");
const $gameOverReset = $("#game-over-button");

// Main Display 
const $playerScore = $("#player-score");
const $highScore = $("#high-score");
const $level = $("#level");
const $lives = $("#lives");
const $turnStart = $("#turn-start");
const $enemiesLeft = $("#enemies-left");

const getLocalStorage = (key) => {
	return Number(localStorage.getItem(key));
};
const setLocalStorage = (key, value) => {
	localStorage.setItem(key, value);
};

const game = {
	// get initial vals from local storage or set default.
	highScore: getLocalStorage('highscore') > 5000 ? getLocalStorage('highscore') : 5000,
	isSolo: isSolo,
	isPlayer1Turn: true,
	isPaused: false,
	isMuted: false,
	animation1: true,
	maxClones: 20,
	currentGameLevel: 1,
	initialClones: 10,
	player1GameData: {
		score: getLocalStorage('player1score') || 0,
		lives: getLocalStorage('player1lives') || 3,
		clones: getLocalStorage('player1clones') || 10,
		mothership: getLocalStorage('player1mothership') || 10,
		level: getLocalStorage('player1level') || 1,
		isDead: false,
		accurateShots: getLocalStorage('player1accurateshots') || 0,
		totalShots: getLocalStorage('player1totalshots') || 0,
		bossLevel: false,
		img: player1Img
	},
	player2GameData: {
		score: getLocalStorage('player2score') || 0,
		lives: getLocalStorage('player2lives') || 3,
		clones: getLocalStorage('player2clones') || 10,
		mothership: getLocalStorage('player2mothership') || 10,
		level: getLocalStorage('player2level') || 1,
		isDead: false,
		accurateShots: getLocalStorage('player2accurateshots') || 0,
		totalShots: getLocalStorage('player2totalshots') || 0,
		bossLevel: false,
		img: player2Img
	},
	getPlayerData() {
		const playerData = this.isPlayer1Turn ? this.player1GameData : this.player2GameData;
		return playerData;
	},
	getPlayerStorageString() {
		const playerStorageString = this.isPlayer1Turn ? 'player1' : 'player2';
		return playerStorageString;
	},
	getPlayerDisplayString() {
		const playerDisplayString = this.isPlayer1Turn ? 'Player 1' : 'Player 2';
		return playerDisplayString;
	},
	getPlayerAccuracy() {
		const playerData = this.getPlayerData();
		if (playerData.totalShots === 0) {
			$playerAccuracy.text(`Firing Accuracy: 100%`);
		} else {		
			const percentAcc = playerData.accurateShots / playerData.totalShots * 100;
			const roundedPercentAcc = round(percentAcc, 1);
			$playerAccuracy.text(`Firing Accuracy: ${roundedPercentAcc}%`);
		}
	},
	getPlayerStats() {
		const playerString = this.getPlayerStorageString();
		const playerData = {
			score: getLocalStorage(playerString + "score"),
			lives: getLocalStorage(playerString + "lives"),
			clones: getLocalStorage(playerString + "clones"),
			mothership: getLocalStorage(playerString + "mothership"),
			isDead: getLocalStorage(playerString + "isdead"),
			accurateShots: getLocalStorage(playerString + "accurateshots"),
			totalShots: getLocalStorage(playerString + "totalshots"),
			bossLevel: getLocalStorage(playerString + "bosslevel")
		};
		return playerData;
	},
	updateDisplay() {
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();
		$playerScore.text(`${playerString} Score: ${playerData.score}`);
		$highScore.text(`High Score: ${this.highScore}`);
		$level.text(`Level: ${playerData.level}`);
		$lives.text(`${playerString} Lives: ${playerData.lives}`);
		if (playerData.bossLevel) {
			$enemiesLeft.text(`Shield: ${playerData.mothership}`);
		} else {
			$enemiesLeft.text(`Clones: ${playerData.clones}`);
		}

	},
	savePlayerStats() {
		const playerData = this.getPlayerData();
		const playerStorageString = this.getPlayerStorageString();

		setLocalStorage(playerStorageString + "score", playerData.score);
		setLocalStorage(playerStorageString + "lives", playerData.lives);
		setLocalStorage(playerStorageString + "clones", playerData.clones);
		setLocalStorage(playerStorageString + "mothership", playerData.mothership);
		setLocalStorage(playerStorageString + "isdead", playerData.isDead);
		setLocalStorage(playerStorageString + "accurateshots", playerData.accurateShots);
		setLocalStorage(playerStorageString + "totalshots", playerData.totalShots);
		setLocalStorage("highscore", this.highScore);

		// check if in clone part of level or mothership part
		if (playerData.mothership != 0) {
			setLocalStorage(playerStorageString + "bosslevel", true);
		} else {
			setLocalStorage(playerStorageString + "bosslevel", false);		
		}
	},
	playerDeath() {
		// call this function before switching turns
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();
		const otherPlayerString = this.isPlayer1Turn ? "Player 2" : "Player 1";

		playerData.lives--;
		setTimeout(stopAnimations, 20);
		laserFactory.lasers = [];
		$endOfTurnText.text(`${playerString} has died.`);
		$endOfTurnStartTurn.text(`${isSolo ? playerString : otherPlayerString} Start Turn`);
		this.getPlayerAccuracy();
		showModal($endOfTurnModal);
		this.updateDisplay();
		this.savePlayerStats();
	},
	playerSwitch() {
		const playerData = this.getPlayerData();
		this.currentGameLevel = playerData.level;
		this.isPlayer1Turn = !this.isPlayer1Turn;
	},
	pause() {
		this.isPaused = !this.isPaused;
		if (this.isPaused) {
			showModal($pauseModal, true);
			// setTimeout(stopAnimations, 20);
		} else {
			// this makes it so I can press enter and toggle if it's paused
			closeAllModals();
			this.isPaused = false;
			// resume animations

			if (!isAnimated) {
				animateShips();
			}
			event.stopPropagation();
		}
	},
	startTurn() {
		// switch all stats displayed // affected
		const playerShip = this.isPlayer1Turn ? player1Ship : player2Ship;
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();

		// readjusts player 1 and player 2 image while still instantiating from same Player class
		playerShip.__proto__.draw = function() {		
			let x = this.body.x;
			let y = this.body.y;
			ctx.drawImage(playerData.img, x, y);
		}

		this.currentGameLevel = playerData.level;
		this.updateDisplay();
		$turnStart.text(`${playerString} Start`)
			.css("animation", "fadeAndScale 1s ease-in forwards");

		// if no clones remaining, display mothership shield instead
		if (playerData.bossLevel) {
			this.initMothershipLevel();
		} else {
			this.initClonesLevel(playerData.clones);
		}
		if (!isAnimated) {
			animateShips();
		}
	},
	setPlayerClones() {
		const playerData = this.getPlayerData();
		console.log(this.initialClones);
		console.log(Math.min(this.initialClones + (playerData.level - 1) * 2, this.maxClones));
		playerData.clones = Math.min(this.initialClones + (playerData.level - 1) * 2, this.maxClones);
	},
	initClonesLevel() {
		const playerData = this.getPlayerData();

		laserFactory.lasers = [];
		cloneFactory.clones = [];
		mothershipFactory.motherships = [];
		initClones(playerData.clones);
	},
	initMothershipLevel() {
		const playerData = this.getPlayerData();
		laserFactory.lasers = [];
		cloneFactory.clones = [];
		mothershipFactory.motherships = [];
		initMothership();
		mothershipFactory.motherships[0].shield = playerData.mothership;
		$enemiesLeft.text(`Shield: ${playerData.mothership}`);
	},
	endLevel() {
		laserFactory.lasers = [];
		cloneFactory.clones = [];
		mothershipFactory.motherships = [];

		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();
		this.currentGameLevel++;
		playerData.level = this.currentGameLevel;
		this.setPlayerClones();

		$enemiesLeft.text(`Clones: ${playerData.clones}`);
		$endOfLevelMessage.text(`You beat Level ${this.currentGameLevel - 1}!`);
		$endOfLevelNextLevelButton.text(`Begin Level ${this.currentGameLevel}`);
		$endOfLevelScore.text(`${playerString} Score: ${playerData.score}`);

		showModal($endOfLevelModal, false, true);
		this.getPlayerAccuracy();
		playerData.mothership = 10;
		this.savePlayerStats();
		this.updateDisplay();
	},
	hitMothership() {
		const playerData = this.getPlayerData();
		const mothership = mothershipFactory.motherships[0];
		mothership.shield--;
		playerData.mothership = mothership.shield;
		$enemiesLeft.text(`Shield: ${playerData.mothership}`);
		playerData.accurateShots++;
		playerData.totalShots++;
		if (mothership.shield <= 0) {
			this.killMothership();
		}
	},
	killMothership() {
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();

		playerData.score += 1500;

		$playerScore.text(`${playerString} Score: ${playerData.score}`);
		this.checkHighScore(playerData.score);
		playerData.bossLevel = false;
		this.endLevel();
	},
	killClone() {
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();

		playerData.clones--;
		$enemiesLeft.text(`Clones: ${playerData.clones}`);
		playerData.accurateShots++;
		playerData.totalShots++;
		playerData.score += 100;
			
		$playerScore.text(`${playerString} Score: ${playerData.score}`);

		if (playerData.clones == 0) {
			playerData.bossLevel = true;
			this.initMothershipLevel();
		}

		this.checkExtraLives(playerData.score);
		this.checkHighScore(playerData.score);
	},
	checkHighScore(score) {
		if (score > this.highScore) {		
			this.highScore = score;
			$highScore.text(`High Score: ${this.highScore}`);
		}
	},
	reset() {
		this.setDefault();
		returnToTitle();
	},
	checkExtraLives(score) {
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();

		if (score === 9000 || score === 15000 || score === 22000) {
			playerData.lives++;
			$lives.text(`${playerString} Lives: ${playerData.lives}`);
			if (this.animation1) {
				$("#extra-life").css("animation", "extraLives 1s ease-in forwards");
				this.animation1 = false;
			} else {
				$("#extra-life").css("animation", "extraLives2 1s ease-in forwards");
				this.animation1 = true;
			}
		}
	},
	setDefault() {
		this.isPaused = false;
		this.isMuted = false;
		setLocalStorage("highscore", game.highScore); // save high score

		setLocalStorage("player1lives", 3);
		setLocalStorage("player1score", 0);
		setLocalStorage("player1accurateshots", 0);
		setLocalStorage("player1totalshots", 0);
		setLocalStorage("player1level", 1);
		setLocalStorage("player1clones", game.initialClones);
		setLocalStorage("player1mothership", 10);
		setLocalStorage("player1bosslevel", false);
		setLocalStorage("player1isdead", false);

		setLocalStorage("player2lives", 3);
		setLocalStorage("player2score", 0);
		setLocalStorage("player2accurateshots", 0);
		setLocalStorage("player2totalshots", 0);
		setLocalStorage("player2level", 1);
		setLocalStorage("player2clones", game.initialClones);
		setLocalStorage("player2mothership", 10);
		setLocalStorage("player2bosslevel", false);
		setLocalStorage("player2isdead", false);

		ctx.clearRect(0, 0, canvas.width, canvas.height);
	},
	die(ship) {
		var playerData = this.getPlayerData();
		if (ship === player1Ship || ship === player2Ship) { // if player dies
			this.playerDeath();
			this.checkGameEnd();
		} else {
			if (!playerData.bossLevel) { // if a clone dies
				const index = cloneFactory.clones.indexOf(ship);
				cloneFactory.clones.splice(index, 1);
				this.killClone();
			} else { // if a mothership dies
				this.killMothership();
			}
		}
	},
	checkGameEnd() {
		const playerData = this.getPlayerData();

		if (this.isSolo) {
			if (playerData.lives <= 0) {
				playerData.isDead = true;
				this.gameOver();
			}
		} else {
			if (playerData.lives <= 0) {
				playerData.isDead = true;
			}
			// if game is over, end it; otherwise, switch turns
			if (this.player1GameData.isDead && this.player2GameData.isDead) {
				this.gameOver();
			} else {
				this.playerSwitch();
			}
		}
		this.updateDisplay();
	},
	gameOver() {
		showModal($gameOverModal);
		
		setTimeout(stopAnimations, 20);
	}
};


//  ***** EVENTS *****

$pauseClose.on("click", function(event) {
	game.pause();
});
$resetButton.on("click", function(event) {
	game.reset();
});
$pauseMute.on("click", function(){
	game.isMuted = !game.isMuted;
	if (game.isMuted) {
		$pauseMute.text("Unmute");
		$endOfLevelMute.text("Unmute");
		laserSound.pause();
	} else {
		$pauseMute.text("Mute");
		$endOfLevelMute.text("Mute");
		laserSound.play();
	}
});
$endOfLevelMute.on("click", function(){
	game.isMuted = !game.isMuted;
	if (game.isMuted) {
		$pauseMute.text("Unmute");
		$endOfLevelMute.text("Unmute");
		laserSound.pause();
	} else {
		$pauseMute.text("Mute");
		$endOfLevelMute.text("Mute");
		laserSound.play();
	}
});
$endOfLevelNextLevelButton.on("click", (event) => {
	closeAllModals();
	event.stopPropagation();
	game.initClonesLevel();
});
$endOfTurnStartTurn.on("click", (event) => {
	closeAllModals();
	setTimeout(stopAnimations, 20);

	requestAnimationFrame(animateShips);
	event.stopPropagation();
	game.startTurn();
});

const showModal = (modal, isPause, keepAnimations) => {
	closeAllModals();
	if (!keepAnimations) {
		setTimeout(stopAnimations, 20);
	}
	modal.addClass("show-modal");
	if (!isPause) {
		document.removeEventListener("keydown", addKeys);
		eventListenersAttached = false;
	}
};
const closeAllModals = () => {
	$(".show-modal").removeClass("show-modal");
	if (!eventListenersAttached) {
		document.addEventListener("keydown", addKeys);
	}
};

$(window).on('beforeunload', () => { // restarts game when browser is refreshed
	game.setDefault();
});

// ***** FUNCTIONS *****

const returnToTitle = () => {
	const currentURL = window.location.href;
	const urlWithoutQueryParams = currentURL.split("?")[0];
	const titleScreenURL = urlWithoutQueryParams.replace("game.html", "index.html");
	
	window.location = titleScreenURL;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const setDefaultDisplay = () => {
	const playerData = game.getPlayerData();
	const playerString = game.getPlayerDisplayString();

	$highScore.text(`High Score: ${game.highScore}`);
	$playerScore.text(`${playerString} Score: ${playerData.score}`);
	$level.text(`Level: ${playerData.level}`);
	$lives.text(`${playerString} Lives: ${playerData.lives}`);
	$enemiesLeft.text(`Clones: ${game.initialClones}`);
};
const initMothership = () => {
	mothershipFactory.generateMothership(new Mothership());		
	mothershipFactory.motherships[0].initialize();
};
const initClones = (numClones) => {
	for (let i = 0; i < numClones; i++) {
		cloneFactory.generateClone(new Clone());
		cloneFactory.clones[i].initialize();
	}
};
const round = (value, precision) => {
	const multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
};

setDefaultDisplay();
game.startTurn();
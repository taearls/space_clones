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
		clones: getLocalStorage('player1clones') || this.initialClones,
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
		clones: getLocalStorage('player2clones') || this.initialClones,
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
		if (this.bossLevel) {
			$enemiesLeft.text(`Shield: ${playerData.mothership}`);
		} else {
			$enemiesLeft.text(`Clones: ${playerData.clones}`);
		}

	},
	savePlayerStats() {
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerStorageString();

		setLocalStorage(playerString + "score", playerData.score);
		setLocalStorage(playerString + "lives", playerData.lives);
		setLocalStorage(playerString + "clones", playerData.clones);
		setLocalStorage(playerString + "mothership", playerData.mothership);
		setLocalStorage(playerString + "isdead", playerData.isDead);
		setLocalStorage(playerString + "accurateshots", playerData.accurateShots);
		setLocalStorage(playerString + "totalshots", playerData.totalShots);
		setLocalStorage("highscore", this.highScore);

		// check if in clone part of level or mothership part
		if (playerData.mothership != 0) {
			setLocalStorage(playerString + "bosslevel", true);
		} else {
			setLocalStorage(playerString + "bosslevel", false);		
		}
	},
	soloGameDeath() {
		stopAnimatons();
		laserFactory.lasers = [];
		$endOfTurnText.text("Player 1 has died.");
		$endOfTurnStartTurn.text("Player 1 Start Turn");
		this.getPlayerAccuracy();
		showModal($endOfTurnModal);
		// this.updateDisplay();
		this.savePlayerStats();
	},
	playerSwitch() {
		const player = this.getPlayerDisplayString();
		const otherPlayer = this.isPlayer1Turn ? "Player 2" : "Player 1";
		this.currentGameLevel = this.isPlayer1Turn ? this.player1GameData.level : this.player2GameData.level;

		// save, switch players, get other player's stats
		this.savePlayerStats();
		this.isPlayer1Turn = !this.isPlayer1Turn;
		this.getPlayerAccuracy();

		// set modal
		$endOfTurnText.text(`${player} has died.`);
		$endOfTurnStartTurn.text(`${otherPlayer} Start Turn`);
		showModal($endOfTurnModal);
		laserFactory.lasers = [];
		stopAnimatons();
	},
	pause() {
		this.isPaused = !this.isPaused;
		if (this.isPaused) {
			showModal($pauseModal);
			cancelAnimationFrame(cancelMe);
		} else {
			// this makes it so I can press enter and toggle if it's paused
			closeAllModals();
			this.isPaused = false;
			// resume animations
			cancelAnimationFrame(cancelMe);
			requestAnimationFrame(animateShips);
			event.stopPropagation();
		}
	},
	startTurn() {
		// display player 1 start or player 2 start
		// switch all stats displayed // affected
		const playerShip = this.isPlayer1Turn ? player1Ship : player2Ship;
		const playerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();
		// readjusts player 1 and player 2 image while still instantiating from same Player class
		playerShip.__proto__.draw = function() {		
			let x = this.body.x;
			let y = this.body.y;
			let width = this.body.width;
			let height = this.body.height;
			ctx.drawImage(playerData.img, x, y);
		}

		this.currentGameLevel = playerData.level;
		this.updateDisplay();
		$turnStart.text(`${playerString} Start`)
			.css("animation", "fadeAndScale 1s ease-in forwards");

		// if no clones remaining, display mothership shield instead
		if (this.bossLevel) {
			this.initMothershipLevel();
		} else {
			this.initClonesLevel(playerData.clones);
		}
	},
	setPlayerClones() {
		const playerData = this.getPlayerData();
		console.log(playerData);
		console.log(this.initialClones);
		console.log(this.maxClones);
		playerData.clones = Math.min(this.initialClones + (playerData.level - 1) * 2, this.maxClones);
		console.log(playerData.clones);
	},
	initClonesLevel(clones) {
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
		$endOfLevelScore.text(`Player 1 Score: ${playerData.score}`);

		showModal($endOfLevelModal);
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
		const mothership = mothershipFactory.motherships[0];
		playerData.score += 1500;
		$playerScore.text(`Player 1 Score: ${playerData.score}`);
		this.checkHighScore(playerData.score);
		this.bossLevel = false;
		this.endLevel();
	},
	killClone() {
		const playerData = this.getPlayerData();
		playerData.clones--;
		$enemiesLeft.text(`Clones: ${playerData.clones}`);
		playerData.accurateShots++;
		playerData.totalShots++;
		playerData.score += 100;
			
		$playerScore.text(`Player 1 Score: ${playerData.score}`);

		if (playerData.clones == 0) {
			$enemiesLeft.text("Shield: 10");
			this.bossLevel = true;
			this.initMothershipLevel();
		}

		this.checkExtraLives(playerData.score);
		this.checkHighScore(playerData.score);
	},
	checkHighScore(score) {
		if (score > Number(this.highScore)) {		
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
		if (score === 9000 || score === 15000 || score === 22000) {
			playerData.lives++;
			$lives.text(`Player 1 Lives: ${playerData.lives}`);
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
		this.bossLevel = false;
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
		var otherPlayerData = this.isPlayer1Turn ? this.player2GameData : this.player1GameData;
		if (ship === player1Ship || ship === player2Ship) { // if player dies
			if (!this.isSolo) {
				if (this.bossLevel && !otherPlayerData.bossLevel) {
					this.bossLevel = false;
				} else if (!this.bossLevel && otherPlayerData.bossLevel) {
					this.bossLevel = true;
				}
				this.playerSwitch();
			} else {
				this.soloGameDeath();
			}
			this.checkGameEnd();
		} else {
			if (!this.bossLevel) { // if a clone dies
				const index = cloneFactory.clones.indexOf(ship);
				cloneFactory.clones.splice(index, 1);
				this.killClone();
			} else { // if a mothership dies
				this.killMothership();
			}
		}
	},
	checkGameEnd() {
		const currentPlayerData = this.getPlayerData();
		const playerString = this.getPlayerDisplayString();

		if (this.isSolo) {
			currentPlayerData.lives--;
			$lives.text(`${playerString} Lives: ${currentPlayerData.lives}`);
			if (currentPlayerData.lives <= 0) {
				currentPlayerData.isDead = true;
				this.gameOver();
			}
		} else {
			currentPlayerData.lives--;
			if (!currentPlayerData.isDead) {
				$lives.text(`${playerString} Lives: ${currentPlayerData.lives}`);
			}
			if (currentPlayerData.lives <= 0 && !currentPlayerData.isDead) {
				currentPlayerData.isDead = true;
				if (this.player1GameData.isDead && this.player2GameData.isDead) {
					this.gameOver();
				} else {
					this.playerSwitch();
				}
			}
		}
	},
	gameOver() {
		showModal($gameOverModal);
		setTimeout(stopAnimatons, 2000);
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
	stopAnimatons();

	requestAnimationFrame(animateShips);
	event.stopPropagation();
	game.startTurn();
});

const showModal = (modal) => {
	closeAllModals();
	modal.addClass("show-modal");
};
const closeAllModals = () => {
	$(".show-modal").removeClass("show-modal");
};

$(window).on('beforeunload', () => { // restarts game when browser is refreshed
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
const setDefaultDisplay = () => {
	const playerData = game.getPlayerData();
	const playerString = game.getPlayerDisplayString();
	const highScore = getLocalStorage("highscore") > 5000 ? getLocalStorage("highscore") : setLocalStorage("highscore", 5000);
	$highScore.text(`High Score: ${highScore}`);
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
initClones(game.initialClones);
animateShips();

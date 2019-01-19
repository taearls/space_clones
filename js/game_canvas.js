// ***GAME CANVAS***

const playerShield = 1;
const playerFirepower = 1;

const initPlayer1 = () => {
	player1Ship = new Player(playerFirepower, playerShield);
  player1Ship.initialize();
};
const initPlayer2 = () => {
	player2Ship = new Player(playerFirepower, playerShield);
  player2Ship.initialize();
};
initPlayer1();
initPlayer2();

initStars(200);
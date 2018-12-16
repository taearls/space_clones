addKeys();
// ***GAME CANVAS***

const playerShield = 1;
const playerFirepower = 1;
// instantiate ships for player 1 and player 2
const initPlayer1 = () => {
	player1Ship = new Player(playerFirepower, playerShield);
}
const initPlayer2 = () => {
	player2Ship = new Player(playerFirepower, playerShield);
}
initPlayer1();
player1Ship.initialize();
initPlayer2();
player2Ship.initialize();
initStars(200);


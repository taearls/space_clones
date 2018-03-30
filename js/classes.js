// initialize generic Ship class
class Ship {
	constructor() {
		this.name = name;
		this.firepower = firepower;
		this.shield = shield;
	}
	fire(target) {
		// 
	}
	move() {
		// for enemies, increment speed with levels
	}
	die() {
		// animation ends
		// some sort of explosion graphic overlaying the ship sprite
		// update enemies remaining
		// update player lives
	}
}

//
class Player extends Ship {
	constructor() {
		super(firepower, shield)
		this.name = input.val();
		this.playerScore = 0;
	}
	score() {
		// define parameters to increment playerScore
	}
	move() {
		// define keydowns for left and right arrows, control of it
	}
}

class Alien extends Ship {
	constructor() {
		super(name, firepower, shield);
		this.speed = speed;
	}
}

class Mothership extends Ship {
	constructor() {
		super(name, firepower, shield);
		this.speed = speed;
	}
}
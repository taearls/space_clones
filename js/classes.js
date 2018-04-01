// initialize generic Ship class
class Ship {
	constructor(firepower, shield, speed) {
		this.firepower = firepower;
		this.shield = shield;
		this.body = {};
		this.direction = "";
	}
	initialize() {
		this.body = {
			x: 0,
			y: 0,
			r: 0,
			e: 0
		};
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

// class for player ships
class Player extends Ship {
	constructor(firepower, shield, speed) {
		super(firepower, shield);
		this.name = "Player 1";
		this.body = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		}
	}
	move() {
		// define keydowns for left and right arrows, control of it
	}
	draw(x, y, width, height) {
		this.body.x = x;
		this.body.y = y;
		this.body.width = width;
		this.body.height = height;
		ctx2.beginPath();
		ctx2.rect(x, y, width, height);
		ctx2.fillStyle = "#AAB";
		ctx2.fill();
		ctx2.closePath();
	}
}

// instantiate ships for player 1 and player 2
// const player1Ship = new Player ();
// const player2Ship = new Player ();

// class for basic enemies
class Clone extends Ship {
	constructor() {
		super(name, firepower, shield);
		this.speed = speed;
	}
}

// class for end of level enemies
class Mothership extends Ship {
	constructor() {
		super(name, firepower, shield);
		this.speed = speed;
	}
}

// instantiate star class for background
class Star {
	constructor(x, y, dy, radius) {
		this.x = x;
		this.y = y;
		this.dy = dy;
		this.radius = radius;
	}
	draw() {
		ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
		ctx.fill();
	}
	update() {
		if (this.y + this.radius >= canvas.height) {
			this.y = this.radius;
		}
	}
	move() {
		this.y += this.dy;
	}
}

// ***** FACTORIES *****

// factory to store clones
const cloneFactory = {
	clones: [],
	generateClone() {
		const newClone = new Clone();
		this.clones.push(newClone);
		return newClone;
	},
	findClone(index) {
		return this.clones[index];
	}
}

// factory to store motherships
const mothershipFactory = {
	motherships: [],
	generateMothership() {
		const newMothership = new Mothership();
		this.motherships.push(newMothership);
		return newMothership;
	},
	findMothership(index) {
		return this.Motherships[index];
	}
}
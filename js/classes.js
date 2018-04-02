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
			x: (canvas.width / 2 - 50),
			y: 500,
			width: 100,
			height: 100
		}
	}
	initialize() {
		this.body = {
			x: (canvas.width / 2 - 50),
			y: 500,
			width: 100,
			height: 100
		}
	}
	move() {
		if (this.direction === "left") {
			// if the direction changes to left, subtract speed value from x
			this.body.x -= this.speed;
		} else if (this.direction === "right") {
			// if the direction changes to right, add speed value to x
			this.body.x += this.speed;
		}
	}
	draw() {
		let x = this.body.x;
		let y = this.body.y;
		let width = this.body.width;
		let height = this.body.height;
		ctx2.beginPath();
		ctx2.rect(x, y, width, height);
		ctx2.fillStyle = "#AAB";
		ctx2.fill();
		ctx2.closePath();
	}
}

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
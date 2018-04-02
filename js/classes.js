// initialize generic Ship class
class Ship {
	constructor(firepower, shield) {
		this.firepower = firepower;
		this.shield = shield;
		this.body = {};
		this.direction = "down";
		this.laserFired = false;
	}
	initialize() {
		this.body = {
			x: 30,
			y: 30,
			width: 30,
			height: 30
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
	constructor(firepower, shield) {
		super(firepower, shield);
		this.name = "Player 1";
		this.body = {
			x: 300,
			y: 500,
			width: 100,
			height: 100
		};
		// charge == how many lasers player can fire.
		this.charge = 10;
	}
	initialize() {
		this.body = {
			x: 300,
			y: 500,
			width: 100,
			height: 100
		}
	}
	initLaser() {
		this.laser = {
			x: this.body.x + (this.body.width / 2),
			y: this.body.y,
			dy: -10,
			width: 1,
			height: 1
		}
	}
	move() {
		let speed = 5;
		const rightBorder = canvas.width - this.body.width; // or if circle, this.body.radius
		const leftBorder = 0;
		if (this.direction === "left") {
			// if the direction changes to left, subtract speed value from x
			if (this.body.x <= leftBorder) {
				speed = 0;
				this.body.x = 0;
			} else {
				speed = 5;
				this.body.x -= speed;
			}
		} else if (this.direction === "right") {
			// if the direction changes to right, add speed value to x
			if (this.body.x >= rightBorder - 1) {
				speed = 0;
				this.body.x = rightBorder - 1;
			} else {
				speed = 5;
				this.body.x += speed;
			}
		}
	}
	draw() {
		let x = this.body.x;
		let y = this.body.y;
		let width = this.body.width;
		let height = this.body.height;
		ctx2.beginPath();
		ctx2.rect(x, y, width, height);
		ctx2.fillStyle = "firebrick";
		ctx2.fill();
		ctx2.closePath();
	}
	fire() {
		// this.laser.y = this.body.y;
		// let y = this.body.y;
		if (this.charge > 0) {
			this.laser.y += this.laser.dy;
			if (this.laser.y === 0) {
				this.laser.dy = 0;
			}
		} else {
			// console.log("reload!");
		}
	}
	drawLaser() {
		// function doesn't work when called again
		// x of firing laser needs to be in center of the ship
		if (this.charge > 0) {
			this.laser.x = this.body.x + (this.body.width / 2);
			let x = this.laser.x;
			// let dy = this.laser.dy;
			// this.laser.y = this.body.y;
			let y = this.laser.y;
			let width = this.laser.width;
			let height = this.laser.height;
			// dy is the velocity of the laser
			ctx2.beginPath();
			ctx2.rect(x, y, width, height);
			ctx2.strokeStyle = "green";
			ctx2.stroke();
			ctx2.closePath();
		}
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
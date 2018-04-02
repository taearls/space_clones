// initialize generic Ship class
class Ship {
	constructor(firepower, shield) {
		this.firepower = firepower;
		this.shield = shield;
		this.body = {};
		this.direction = "down";
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
		}
	}
	initialize() {
		this.body = {
			x: 300,
			y: 500,
			width: 100,
			height: 100
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
		// x of firing laser needs to be in center of the ship
		let x = this.body.x + (this.body.width / 2);
		let y = this.body.y;
		let width = 1;
		let height = 1;
		// dy is the velocity of the laser
		let dy = (-10);
		ctx2.beginPath();
		ctx2.rect(x, y, width, height);
		ctx2.strokeStyle = "firebrick";
		ctx2.stroke();
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
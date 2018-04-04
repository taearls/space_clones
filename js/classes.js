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

// initialize generic Ship class
class Ship {
	constructor(firepower, shield) {
		this.firepower = 1;
		this.shield = 1;
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
		this.body = {
			x: 300,
			y: 500,
			width: 100,
			height: 100
		};
		// charge == how many lasers player can fire.
		this.charge = Infinity;
		this.shotsFired = [];
	}
	initialize() {
		this.body = {
			x: (gameCanvas.width / 2) - (this.body.width / 2),
			y: (gameCanvas.height - this.body.height * 2),
			width: 20,
			height: 20
		}
	}
	initLaser() { // creates player bullet and "fires" it(i.e. adds it to shotsFired)
		if (this.shotsFired.length < this.charge) {		
			this.shotsFired.push(new Lasers(this.body.x + (this.body.width / 2), this.body.y, 10, 10, -10));
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
	// fire(laser) {
		
	// }
}

// class for basic enemies
class Clone extends Ship {
	constructor() {
		super();
		this.firepower = 1;
		this.shield = 1;
		this.speed = 2;
		this.body = {};
		this.direction = "left";
		this.distBetweenShips = 100;
		this.descent = 30;
		this.charge = Infinity;
		this.shotsFired = [];
	}
	initialize() {
		this.body = {
			x: canvas.width - (this.distBetweenShips * (cloneFactory.clones.length)),
			y: 100,
			width: 20,
			height: 20
		}
		// if dist between ships makes x a negative value.
		// only bug is if I need to start with more than two rows of ships
		if (this.body.x < 0) {
			this.body.x = Math.abs(this.body.x);
			this.body.y += this.descent;
			this.direction = "right";
			if (this.body.x > canvas.width) {
				this.body.x -= canvas.width;
				this.body.y += this.descent;
				this.direction = "left";
			}
		} 
	}
	move() {
		const leftBorder = 0;
		const rightBorder = canvas.width - this.body.width; // or if circle, this.body.radius

		if (this.direction === "left") {
			// if the direction changes to left, subtract speed value from x
			if (this.body.x <= leftBorder) {
				this.speed = 0;
				this.body.x = 0;
				this.direction = "down";
				this.speed = this.descent;
				this.body.y += this.speed;
				this.direction = "right";
			} else {
				this.speed = 2;
				this.body.x -= this.speed;
			}
		} else if (this.direction === "right") {
			// if the direction changes to right, add speed value to x
			if (this.body.x >= rightBorder - 1) {
				this.speed = 0;
				this.body.x = rightBorder - 1;
				this.direction = "down";
				this.speed = this.descent;
				this.body.y += this.speed;
				this.direction = "left";
			} else {
				this.speed = 2;
				this.body.x += this.speed;
			}
		}// } else if (this.direction === "down") {
		// 	this.speed = 10;
		// 	this.body.y += this.speed;
		// 	this.direction = "right";
		// }
	}
	fire() {
		this.shotsFired.push(new Lasers(this.body.x + (this.body.width / 2), this.body.y + this.body.height, 10, 10, 2))
		for (let i = 0; i < this.shotsFired.length; i++) {
			this.shotsFired[i].move();
		}
			
		
		// call this function with a timer, so it will fire every x seconds.
	}
	update() {
		const leftBorder = 0;
		const rightBorder = canvas.width - this.body.width;
		if (this.body.y + this.descent >= gameCanvas.height - 50) {
			this.body.y = 100;
			if (this.body.x >= leftBorder){
				this.direction = "right";
			} else if (this.body.x <= rightBorder) {
				this.direction = "left";
			}
		}
	}
	draw() {
		// if (this.body.x < 0) {
		// 	this.body.x += gameCanvas.width;
		// 	this.body.y += this.descent;
		// }
		let x = this.body.x;
		let y = this.body.y;
		let width = this.body.width;
		let height = this.body.height;
		ctx2.beginPath();
		ctx2.rect(x, y, width, height);
		ctx2.fillStyle = "#0BD919";
		ctx2.fill();
		ctx2.closePath();
	}
}

// class for end of level enemies
class Mothership extends Ship {
	constructor() {
		super(name, firepower, shield);
		this.speed = speed;
	}
}

class Lasers {
	constructor(x, y, width, height, dy){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dy = dy;
	}
	draw() {
		ctx2.beginPath();
		ctx2.fillStyle = "#8A69D9";
		ctx2.fillRect(this.x, this.y, this.width, this.height);
		ctx2.closePath();
	}
	move() {
		this.draw();
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
		return this.motherships[index];
	}
}
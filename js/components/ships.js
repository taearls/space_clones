const player2Img = new Image();
player2Img.src = "images/player2_ship.png";
player2Img.width = 60;
player2Img.height = 60;

const playerImg = new Image();
playerImg.src = "images/player_ship.png";
playerImg.width = 60;
playerImg.height = 60;

// class for player ships
class Player {
  constructor(firepower, shield) {
    this.body = {
      x: 300,
      y: 500,
      width: playerImg.width,
      height: playerImg.height
    };
    this.lasersFired = 0;
  }
  initialize() {
    this.body = {
      x: (canvas.width / 2) - (this.body.width / 2),
      y: (canvas.height - this.body.height * 2),
      width: playerImg.width,
      height: playerImg.height
    }
  }
  fireLaser() { // creates player bullet and "fires" it(i.e. adds it to shotsFired)
    laserFactory.generateLaser((this.body.x + 8), (this.body.y - this.body.height), (-6), "player");
    this.lasersFired++;
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
    ctx.drawImage(playerImg, x, y);
  }
}

const cloneImg = new Image();
cloneImg.src = "images/clone_ship.png";
cloneImg.width = 45;
cloneImg.height = 45;
// class for basic enemies
class Clone {
  constructor(index) {
    this.firepower = 1;
    this.shield = 1;
    this.speed = 2;
    this.body = {};
    this.direction = "left";
    this.distBetweenShips = 100;
    this.descent = 55;
    this.row = 1;
    this.index = index;
  }
  calculateRow() {
    const numerator = (this.index + 1) * this.distBetweenShips;
    const denominator = Math.ceil(canvas.width / this.distBetweenShips) * this.distBetweenShips + 1;
    const row = Math.ceil(numerator / denominator);
    this.row = row;
    return row;
  }
  calculateX() {
    let xVal = this.index * this.distBetweenShips;
    const currentRow = this.calculateRow();
    const roundedCanvas = Math.ceil(canvas.width / this.distBetweenShips) * this.distBetweenShips;
    while (xVal >= canvas.width) {
      xVal -= roundedCanvas;
      if (currentRow % 2 === 1) {
        xVal = roundedCanvas - xVal - this.distBetweenShips - 45; // 45 is the ship width
      }    
      if (xVal < 0) {
        xVal += roundedCanvas;
      }
      // }
      if (xVal >= 0 && xVal + this.body.width <= canvas.width) {
        break;
      }
    }
    // if (xVal >= canvas.width) {
    //   xVal -= canvas.width;
    //   xVal = Math.floor(xVal / this.distBetweenShips) * this.distBetweenShips;
    // }
    return xVal;
  }
  initialize() {

    this.body = {
      x: this.calculateX(),
      y: this.descent * this.calculateRow(),
      width: cloneImg.width,
      height: cloneImg.height
    }
    if (this.index === 0) { 
      console.log(canvas.width);
    }
    if (this.index >= 0) {
      console.log("ship: " + parseInt(this.index + 1));
      console.log(this.body);
    }


    if (this.row % 2 === 1) {
      this.direction = "left";
    } else {
      this.direction = "right";
    }

  }
  move(index) {
    const currentClone = cloneFactory.findClone(index);

    const leftBorder = 0;
    const rightBorder = canvas.width; // or if circle, this.body.radius
    
    if (currentClone.direction === "left") {
      // if the direction changes to left, subtract speed value from x
      if (currentClone.body.x <= leftBorder) {
        currentClone.speed = 0;
        currentClone.body.x = 0;
        currentClone.direction = "down";
        currentClone.body.y += currentClone.descent;
        currentClone.direction = "right";
      } else {
        currentClone.speed = 2;
        currentClone.body.x -= currentClone.speed;
      }
    } else if (currentClone.direction === "right") {
      // if the direction changes to right, add speed value to x
      if (currentClone.body.x + currentClone.body.width >= rightBorder - 1) {
        currentClone.speed = 0;
        currentClone.body.x = rightBorder - currentClone.body.width;
        currentClone.direction = "down";
        currentClone.body.y += currentClone.descent;
        currentClone.direction = "left";
      } else {
        currentClone.speed = 2;
        currentClone.body.x += currentClone.speed;
      }
    }
  }
  fire() {
    const indexLaser = laserFactory.generateLaser(this.body.x + 20, this.body.y + this.body.height, 6, "clone");
    laserFactory.lasers[indexLaser].move();
  }
  update(index) {
    const leftBorder = 0;
    const rightBorder = canvas.width;
    if (this.body.y + this.descent >= canvas.height - this.body.height) {
      this.body.y = this.descent;
      if (this.body.x >= leftBorder){
        this.direction = "right";
      } else if (this.body.x + this.body.width <= rightBorder) {
        this.direction = "left";
      }
    }
  }
  draw() {
    let x = this.body.x;
    let y = this.body.y;
    ctx.drawImage(cloneImg, x, y);
  }
}

const mothershipImg = new Image();
mothershipImg.src = "images/mothership.png";
mothershipImg.width = 240;
mothershipImg.height = 150;
// class for end of level enemies
class Mothership {
  constructor() {
    this.firepower = 1;
    this.shield = 10;
    this.speed = 5;
    this.body = {};
    this.direction = "left";
  }
  initialize() { 
    this.body = {
      x: (canvas.width / 2) - (mothershipImg.width / 2),
      y: 100,
      width: mothershipImg.width,
      height: mothershipImg.height
    }
  }
  update() {
    const leftBorder = 0;
    const rightBorder = canvas.width;
    if (this.body.x <= leftBorder){
      this.direction = "right";
    } else if (this.body.x + this.body.width >= rightBorder) {
      this.direction = "left";
    }
  }
  move() {
    if (this.direction === "left") {
      this.body.x -= this.speed;
    } else {
      this.body.x += this.speed;
    }
  }
  fire() {
    const index = laserFactory.generateLaser(this.body.x + 110, this.body.y + this.body.height, 6, "mothership");
    laserFactory.lasers[index].move();
  }
  draw() {
    let x = this.body.x;
    let y = this.body.y;
    ctx.drawImage(mothershipImg, x, y);
  }
}

const laserImg = new Image();
laserImg.src = "images/laser.png";
laserImg.width = 60;
laserImg.height = 100;

class Lasers {
  constructor(x, y, dy, firingShip) {
    this.x = x;
    this.y = y;
    this.width = laserImg.width;
    this.height = laserImg.height;
    this.dy = dy;
    this.firingShip = firingShip;
  }
  draw() {
    ctx.drawImage(laserImg, this.x, this.y);
  }
  move() {
    this.draw();
    this.y += this.dy;
    this.checkDisappear(this);
  }
  removeLaser(laser) {
    const indexLaser = laserFactory.lasers.indexOf(laser);
    laserFactory.deleteLaser(indexLaser);
  }
  destroyTarget(targetedShip, laser) {
    const playerShip = game.isPlayer1Turn ? player1Ship : player2Ship;
    if (targetedShip == playerShip) {
      game.die(playerShip);
    } else if (!game.bossLevel) {
      game.die(targetedShip);
    } else {
      game.hitMothership();
    } 
    this.removeLaser(laser);
  }
  checkDisappear(laser) {
    const indexLaser = laserFactory.lasers.indexOf(laser);
    if (this.y > canvas.height || this.y + this.height < 0) {
      laserFactory.deleteLaser(indexLaser);
    }
  }
}
// ***** FACTORIES *****

// factory to store clones
const cloneFactory = {
  clones: [],
  generateClone() {
    const index = this.clones.length;
    const newClone = new Clone(index);
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

// factory to store lasers
const laserFactory = {
  lasers: [],
  generateLaser(x, y, dy, firingShip) {
    const newLaser = new Lasers(x, y, dy, firingShip);
    this.lasers.push(newLaser);
    const index = this.lasers.length - 1;
    return index;
  },
  findLaser(index) {
    return this.lasers[index];
  },
  deleteLaser(index) {
    this.lasers.splice(index, 1);
  }
}
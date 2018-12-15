const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = canvas.getContext("2d");

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

// create star array to store new stars
let stars = [];
// generate 500 stars with function, push into star array
function initStars(length) {
  length = 200;
  stars = [];
  if (stars.length < length) {
    for (i = 0; i < length; i++) {
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      let radius = Math.random() * 2;
      let dy = Math.random() * 5;
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      stars.push(new Star(x, y, dy, radius))
    }   
  }
}

function animateStars() {
  cancelMe = requestAnimationFrame(animateStars);
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < stars.length; i++) {
    stars[i].draw();
    stars[i].update();
    stars[i].move();
  }
}
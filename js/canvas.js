const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;



const ctx = canvas.getContext("2d");

// write a function that generates a desired amount of circles
const genStars = (numCircles) => {
	for (let i = 0; i < numCircles; i++) {
		ctx.beginPath();

		let x = Math.floor(Math.random() * 1400);
		let y = Math.floor(Math.random() * 800);
		let radius = Math.ceil(Math.random() * 2)
		if (3 < x < 1400 && 3 < y < 800) {
			ctx.arc(x, y, radius, 0, Math.PI * 2)
			ctx.fillStyle = "white";
			ctx.fill();
			ctx.closePath();
		}
	}
}

genStars(500);
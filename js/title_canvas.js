initStars();
animateStars();

window.addEventListener("resize", function(event) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	initStars();
	cancelAnimationFrame(cancelMe);
	requestAnimationFrame(animateStars);
});

if (localStorage.getItem("highscore") == null) {
	$("#high-score").text("High Score: 5000");
} else {
	$("#high-score").text("High Score: " + localStorage.getItem("highscore"));
}
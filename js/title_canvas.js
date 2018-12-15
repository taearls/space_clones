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

//  ***** MODALS *****

const controls = $("#how-to-play");
const closeControls = $(".close-controls");
const prologue = $("#prologue");
const closePrologue = $(".close-prologue");

controls.on("click", function(e) {
	$(".controls-modal").addClass("show-modal");
});

closeControls.on("click", function(e) {
	$(this).parents(".controls-modal").removeClass("show-modal");
	e.stopPropagation();
});

prologue.on("click", function(e) {
	$(".prologue-modal").addClass("show-modal");
});

closePrologue.on("click", function(e) {
	$(this).parents(".prologue-modal").removeClass("show-modal");
	e.stopPropagation();
});
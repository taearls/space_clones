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

//  ***** TITLE SCREEN DISPLAY ***** 

if (localStorage.getItem("player1score") == null) {
	$("#player1-score").text("Player 1 Score: 0");
} else {
	$("#player1-score").text(`Player 1 Score: ${localStorage.getItem("player1score")}`);
}

if (localStorage.getItem("player2score") == null) {
	$("#player2-score").text("Player 2 Score: 0");
} else {
	$("#player2-score").text(`Player 2 Score: ${localStorage.getItem("player2score")}`);
}

if (localStorage.getItem("highscore") == null) {
	$("#high-score").text("High Score: 5000");
} else {
	$("#high-score").text(`High Score: ${localStorage.getItem("highscore")}`);
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
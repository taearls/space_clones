initStars(100);
animateStars();

window.addEventListener("resize", function(event) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	initStars(100);
	cancelAnimationFrame(cancelMe);
	requestAnimationFrame(animateStars);
});

//  ***** TITLE SCREEN DISPLAY ***** 

function setDisplay() {
	if (!localStorage.getItem("highscore")) {
		$("#high-score").text("High Score: 5000");
	} else {
		$("#high-score").text(`High Score: ${localStorage.getItem("highscore")}`);
	}
}
setDisplay();

//  ***** MODALS ***** 

const $openControls = $("#how-to-play");
const $openPrologue = $("#prologue");
const $closeModalButton = $(".close-modal");

$openControls.on("click", function(e) {
	$(".controls-modal").addClass("show-modal");
});

$closeModalButton.on("click", function(e) {
	$(".controls-modal, .prologue-modal").removeClass("show-modal");
	e.stopPropagation();
});

$openPrologue.on("click", function(e) {
	$(".prologue-modal").addClass("show-modal");
});
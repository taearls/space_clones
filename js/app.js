const canvas = $("canvas");

const ctx = canvas[0].getContext("2d");
canvas.attr("width", $(document).width());
canvas.attr("height", $(document).height());

$("#prologue").on("click", function(event){
	console.log("hi");
})
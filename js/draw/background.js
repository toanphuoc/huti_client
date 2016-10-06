function Background(url){
	this.url = url;
}

Background.prototype.setBackground = function(){
	canvas.setBackgroundImage(this.url, canvas.renderAll.bind(canvas), {
	    backgroundImageStretch: true,
		width: canvas.width,
		height: canvas.height,
	});
};

Background.prototype.removeBackground = function(){
	
};		
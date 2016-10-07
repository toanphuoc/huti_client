var canvas = new fabric.Canvas('canvas',{
	backgroundColor: '#EBEBEB'
});

var widthScreen = $(window).width();
canvas.setDimensions({width: 756, height: 302});

var $canvas = $("#canvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var canvasView = new fabric.Canvas('canvas-view');
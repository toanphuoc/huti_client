var canvas = new fabric.Canvas('canvas',{
	backgroundColor: '#EBEBEB'
});

var widthScreen = $(window).width();
canvas.setDimensions({width: 756, height: 302});
// if(widthScreen >= 1200){
// 	canvas.setDimensions({width: 756, height: 302});
// }else if(widthScreen >= 992 && widthScreen < 1200){
// 	canvas.setDimensions({width: 758, height: 250});
// }

var $canvas = $("#canvas");
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

var canvasView = new fabric.Canvas('canvas-view');
// if(widthScreen >= 1200){
// 	canvasView.setDimensions({width: 918 - 30, height: 300});
// }else if(widthScreen >= 992 && widthScreen < 1200){
// 	canvasView.setDimensions({width: 758 - 30, height: 250});
// }
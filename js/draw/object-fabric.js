function undo() {
	console.log('Undo');
}

function redo() {
	console.log('Redo');
}

/**
	Canvas Object
*/
function Canvas(url, color){
	this.color = color;
	this.url = url;
	this.canvasScale = 1; //global
	this.SCALE_FACTOR = 1.01;//global 18/05/2015
}

Canvas.prototype.zoomIn = function(){
	this.canvasScale = this.canvasScale * this.SCALE_FACTOR;

    canvas.setHeight(canvas.getHeight() * this.SCALE_FACTOR);
    canvas.setWidth(canvas.getWidth() * this.SCALE_FACTOR);

    var objects = canvas.getObjects();
    for (var i in objects) {
	    var scaleX = objects[i].scaleX;
	    var scaleY = objects[i].scaleY;
	    var left = objects[i].left;
	    var top = objects[i].top;

	    var tempScaleX = scaleX * this.SCALE_FACTOR;
	    var tempScaleY = scaleY * this.SCALE_FACTOR;
	    var tempLeft = left * this.SCALE_FACTOR;
	    var tempTop = top * this.SCALE_FACTOR;

	    objects[i].scaleX = tempScaleX;
	    objects[i].scaleY = tempScaleY;
	    objects[i].left = tempLeft;
	    objects[i].top = tempTop;

	    objects[i].setCoords();
    }
  
     
    canvas.renderAll();
}

Canvas.prototype.zoomOut = function(){
	this.canvasScale = this.canvasScale / this.SCALE_FACTOR;

    canvas.setHeight(canvas.getHeight() * (1 / this.SCALE_FACTOR));
    canvas.setWidth(canvas.getWidth() * (1 / this.SCALE_FACTOR));

    var objects = canvas.getObjects();
    for (var i in objects) {
      	var scaleX = objects[i].scaleX;
      	var scaleY = objects[i].scaleY;
      	var left = objects[i].left;
      	var top = objects[i].top;

      	var tempScaleX = scaleX * (1 / this.SCALE_FACTOR);
      	var tempScaleY = scaleY * (1 / this.SCALE_FACTOR);
      	var tempLeft = left * (1 / this.SCALE_FACTOR);
      	var tempTop = top * (1 / this.SCALE_FACTOR);

      	objects[i].scaleX = tempScaleX;
      	objects[i].scaleY = tempScaleY;
      	objects[i].left = tempLeft;
      	objects[i].top = tempTop;

        objects[i].setCoords();
    }
            
    canvas.renderAll();
}

Canvas.prototype.setBackground = function(){
	if(this.url != undefined){
		canvas.setBackgroundImage(this.url, canvas.renderAll.bind(canvas), {
		    backgroundImageStretch: true,
			width: canvas.width,
			height: canvas.height,
		});
	}else{
		canvas.backgroundImage = 0;
		canvas.backgroundColor = this.color;
	}
	canvas.renderAll();
};

Canvas.prototype.removeBackground = function(){
	canvas.backgroundImage = 0;
    canvas.backgroundColor = '#EBEBEB';
    canvas.renderAll();
};

Canvas.prototype.removeObjectActive = function(){
	if(canvas.getActiveGroup()){
      	canvas.getActiveGroup().forEachObject(function(o){ canvas.remove(o) });
      	canvas.discardActiveGroup().renderAll();
    } else {
      canvas.remove(canvas.getActiveObject());
    }
}

Canvas.prototype.clean = function(){
	this.removeBackground();
	canvas.clear().renderAll();
}

/**
	Image Object
*/
function ImageObj (url, x, y, width, height) {
	this.url = url; 
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

ImageObj.prototype.draw = function() {
	fabric.Image.fromURL(this.url, function(oImg) {
  		canvas.add(oImg);
  		canvas.renderAll(canvas);
	},{
		top: this.y,
		left: this.x,
		width: this.width,
		height: this.height,
		// scaleX: 1,
		// scaleY: 0.5
	});
};

/**
	IText Object
*/
function IText(text, x, y, fontFamily, fontSize, fill, fontStyle, fontWeight){
	this.text = text;
	this.x = x;
	this.y = y;
	this.fontFamily = fontFamily;
	this.fontSize = fontSize;
	this.fill = fill;
	this.fontStyle = fontStyle;
	this.fontWeight = fontWeight;
}

IText.prototype.draw = function(){
	console.log(this.fontWeight);
	var itext = new fabric.IText(this.text, {
	    left: this.x,
	    top: this.y,
	    fontSize: this.fontSize,
	    fill: this.fill,
	    fontFamily: this.fontFamily,
	    fontWeight: this.fontWeight,
	    fontStyle: this.fontStyle

	});
	canvas.add(itext);
}

function Mask(url, x, y, width, height){
	this.url = url; 
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Mask.prototype.draw = function() {
	fabric.Image.fromURL(this.url, function(oImg) {
  		canvas.add(oImg);
  		canvas.renderAll(canvas);
	},{
		top: this.y,
		left: this.x,
		width: this.width,
		height: this.height,
		globalCompositeOperation: 'source-atop'
		// scaleX: 1,
		// scaleY: 0.5
	});
};

/**
	Image filter Object
*/
function ImageFilter(type){
	this.type = type;
}

ImageFilter.prototype.setFilter = function(){
	var  obj = canvas.getActiveObject();
	if(obj === undefined){
		return;
	}
	if(obj.filters != null){
		obj.filters.pop();
	}
	

	switch(this.type){
		case '0000':
			obj.filters = [];
        	obj.applyFilters(function() {canvas.renderAll(); });  
        	break;
		case 'Blur_filterRadius@4':
			var filter = filter = new fabric.Image.filters.Convolute({
				matrix: [1/16, 1/16, 1/16, 1/16,
				1/16, 1/16, 1/16, 1/16,
				1/16, 1/16, 1/16, 1/16,
				1/16, 1/16, 1/16, 1/16]
			});
			obj.filters.push(filter);
			break;
		case 'Brighten_filterBrightness@-20':
			var filter = new fabric.Image.filters.Brightness({
 				brightness: -20
			});
			obj.filters.push(filter);
			break;
		case 'Brighten_filterBrightness@20':
			var filter = new fabric.Image.filters.Brightness({
 				brightness: 20
			});
			obj.filters.push(filter);
			break;
		case 'Edge_filterAmount@10':
			var filter = filter = new fabric.Image.filters.Convolute({
				matrix: [ 0, -1,  0,
                        -1,  5, -1,
            			0, -1,  0]
			});
			obj.filters.push(filter);
			break;
		case 'Emboss_filterAmount@10':
			var filter = filter = new fabric.Image.filters.Convolute({
				matrix: [-2, -1, 0,
                              -1, 1, 1,
                              0, 1, 2 ]
			});
			obj.filters.push(filter);
			break;
		case 'Grayscale':
			var filter = new fabric.Image.filters.Grayscale();
			obj.filters.push(filter);
			break;
		case 'HSL_hue@0_saturation@0.5_luminance@0.5':
			var rgb = hslToRgb(0, 0.5 * 100, 0.5 * 100);
			var hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'multiply'
			});
			obj.filters.push(filter);
			break;
		case 'HSL_hue@90_saturation@0.5_luminance@0.5':
			var rgb = hslToRgb(270, 0.5 * 100, 0.5 * 100);
			var hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'multiply'
			});
			obj.filters.push(filter);
			break;
		case 'HSL_hue@180_saturation@0.5_luminance@0.5':
			var rgb = hslToRgb(180, 0.5 * 100, 0.5 * 100);
			var hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'lighten'
			});
			obj.filters.push(filter);
			break;
		case 'HSL_hue@270_saturation@0.5_luminance@0.5':
			var rgb = hslToRgb(90, 0.5 * 100, 0.5 * 100);
			var hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'multiply'
			});
		
			obj.filters.push(filter);
			break;
		case 'HSV_hue@0_saturation@0.5_value@0.5':
			var rgb = hsvToRgb(0, 50, 50);
			var hexColor = rgbToHex(rgb[0], rgb[1], rgb[2]);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'multiply'
			});
			obj.filters.push(filter);
			break;
		case 'HSV_hue@90_saturation@0.5_value@0.5':
			var rgb = hsvToRgb(270, 50, 50);
			var hexColor = rgbToHex(rgb[0], rgb[1], rgb[2]);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'multiply'
			});
			obj.filters.push(filter);
			break;
		case 'HSV_hue@180_saturation@0.5_value@0.5':
			var rgb = hsvToRgb(180, 50, 50);
			var hexColor = rgbToHex(rgb[0], rgb[1], rgb[2]);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'lighten'
			});
			obj.filters.push(filter);
			break;
		case 'HSV_hue@270_saturation@0.5_value@0.5':
			var rgb = hsvToRgb(90, 50, 50);
			var hexColor = rgbToHex(rgb[0], rgb[1], rgb[2]);
			var filter = new fabric.Image.filters.Blend({
				color: hexColor,
				mode: 'multiply'
			});
			obj.filters.push(filter);
			break;
		case 'Invert':
			var filter = new fabric.Image.filters.Invert();
			obj.filters.push(filter);
			break;
		case 'Noise_noise@0.3':
			var filter = new fabric.Image.filters.Noise({
			  	noise: 30
			});
			obj.filters.push(filter);
			break;
		case 'Pixelate_pixelSize@4':
			var filter = new fabric.Image.filters.Pixelate({
			  	blocksize: 4
			});
			obj.filters.push(filter);
			break;
		case 'Pixelate_pixelSize@10':
			var filter = new fabric.Image.filters.Pixelate({
			  	blocksize: 10
			});
			obj.filters.push(filter);
			break;
		case 'Pixelate_pixelSize@20':
			var filter = new fabric.Image.filters.Pixelate({
			  	blocksize: 20
			});
			obj.filters.push(filter);
			break;
		case 'RGB_red@100_blue@100_green@100':
			var colorHex = rgbToHex(100, 100, 100);
			var filter = new fabric.Image.filters.Multiply({
			  	color: colorHex
			});
			obj.filters.push(filter);
			break;
		case 'RGB_red@100_blue@100_green@255':
			var colorHex = rgbToHex(100, 100, 255);
			var filter = new fabric.Image.filters.Multiply({
			  	color: colorHex
			});
			obj.filters.push(filter);
			break;
		case 'RGB_red@100_blue@255_green@100':
			var colorHex = rgbToHex(100, 255, 100);
			var filter = new fabric.Image.filters.Multiply({
			  	color: colorHex
			});
			obj.filters.push(filter);
			break;
		case 'RGB_red@255_blue@100_green@100':
			var colorHex = rgbToHex(255, 100, 100);
			var filter = new fabric.Image.filters.Multiply({
			  	color: colorHex
			});
			obj.filters.push(filter);
			break;
		case 'Sepia':
			var filter = new fabric.Image.filters.Sepia();
			obj.filters.push(filter);
			break;
		case 'ShiftHue_filterHueShiftDeg@0':
			//obj.CSS_CANVAS('hue_rotate0');
			break;
		case 'ShiftHue_filterHueShiftDeg@90':
			//obj.CSS_CANVAS('hue_rotate0');
			break;
		case 'ShiftHue_filterHueShiftDeg@180':
			//obj.CSS_CANVAS('hue_rotate0');
			break;
		case 'ShiftHue_filterHueShiftDeg@270':
			//obj.CSS_CANVAS('hue_rotate0');
			break;
		case 'Solarize':

			break;
		case 'SoftBlur_filterAmount@4':
			break;
		case 'Threshold_threshold@0.5':
			var filter = new fabric.Image.filters.RemoveWhite({
			  	threshold: 150,
  				distance: 140
			});
			obj.filters.push(filter);
			break;
		case 'UnsharpMask_filterAmount@4':
			break;
		default:
			break;
	}
		
	obj.applyFilters(canvas.renderAll.bind(canvas));
	
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
     
    return [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
}

function hslToRgb (h, s, l) {

    var r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return { r: r, g: g, b: b }

}
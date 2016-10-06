var propertiesIText = {
	width: 0,
	height: 0,
	fontFamily: 'UTM Agin',
	fontSize: 28,
	fill: '#000',
	fontWeight: 'normal',
	fontStyle: 'normal'
}

$(document).ready(function(){

	$('#view').on('show.bs.modal', function (e) {
  		
  		var json = JSON.stringify(canvas);
  		console.log(json);

  		canvasView.backgroundImage = 0;
    	canvasView.backgroundColor = '#EBEBEB';
    	canvasView.renderAll();
	  	canvasView.clear();
	  	canvasView.renderAll();

		// and load everything from the same json
		canvasView.loadFromJSON(json, function() {
			canvasView.selection = false;
			canvasView.forEachObject(function(o) {
			  	o.selectable = false;
			});
		  	canvasView.renderAll();
		});
	});

	// $('#myModal').on('hide.bs.modal', function (e) {
	// 	canvasView.backgroundImage = 0;
 //    	canvasView.backgroundColor = '#EBEBEB';
 //    	canvasView.renderAll();
	//   	canvasView.clear();
	//   	canvasView.renderAll();
	// });

 	//Create new canvas
 	$('.draw-tools .new').click(function(){
		var objCanvas = new Canvas();
		objCanvas.clean();
	})

	$('.draw-tools .undo').click(function(){
		undo();
	});

	$('.draw-tools .redo').click(function(){
		redo();
	});

	// Remove object active		
	$('.draw-tools .remove').click(function(){
		var objCanvas = new Canvas();
		objCanvas.removeObjectActive();
	});

	// Remove object active	by press key DEL	
	document.onkeydown = function(e) {
	  	if (46 === e.keyCode) {
	  		var objCanvas = new Canvas();
			objCanvas.removeObjectActive();
	  	}
	}

	$('.background-tools .add').click(function(){
		$('#upload_file_background').trigger('click');
		$('#upload_file_background').on('change', function(event){
			var url = URL.createObjectURL(event.target.files[0]);
			var objCanvas = new Canvas(url);
			objCanvas.setBackground();
		});
	});

	$('.background-tools .clear').click(function(){
		var b = new Canvas();
		b.removeBackground();
	});

	// Upload image file
	$('.upload img').click(function(event) {
		var eleImage = $(this);

		$('#upload_file').trigger('click');
		$('#upload_file').on('change', function(event){
			var url = URL.createObjectURL(event.target.files[0]);
			$(eleImage).attr('src', url);
		});
	});

	$('#color-picker-background').spectrum({
		color: "#EBEBEB",
		// showPalette: true,
    	// palette: [["red", "rgba(0, 255, 0, .5)", "rgb(0, 0, 255)"]],
	    cancelText: "Đóng",
    	chooseText: "Chọn",
    	move: function(color) {
		    var color = color.toHexString(); // #ff0000
			var objCanvas = new Canvas(undefined, color);
			objCanvas.setBackground();
		}
	});

	// Change color text
	$("#color-picker").spectrum({
	    color: "#000",
	    cancelText: "Đóng",
    	chooseText: "Chọn",
    	move: function(color) {
		    var color = color.toHexString(); // #ff0000
		    propertiesIText.fill = color;

			if(obj = canvas.getActiveObject()){
	        	obj.fill = propertiesIText.fill;
	        	canvas.renderAll();
	        }
		}
	});

	// Change font family text
	$('.draw-picture .select-font').on('change', function(){
		propertiesIText.fontFamily = $(this).val();
		if(obj = canvas.getActiveObject()){
        	obj.fontFamily = propertiesIText.fontFamily;
        	canvas.renderAll();
        }
	});

	// Change font size text
	$('.draw-picture .bfh-fontsizes').on('change.bfhselectbox', function () {
        propertiesIText.fontSize = $(this).val();
        if(obj = canvas.getActiveObject()){
        	obj.fontSize = propertiesIText.fontSize;
        	canvas.renderAll();
        }
	});

		// Change font bold type
	$('.draw-picture .bold').click(function(event) {
		
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			propertiesIText.fontWeight = 'normal';
		}else{
			propertiesIText.fontWeight = 'bold';
			$(this).addClass('active');
		}

		if(obj = canvas.getActiveObject()){
        	obj.fontWeight = propertiesIText.fontWeight;
        	canvas.renderAll();
        }
	});

	// change font italic type
	$('.draw-picture .italic').click(function(event) {
		if($(this).hasClass('active')){
			$(this).removeClass('active');
			propertiesIText.fontStyle = 'normal';
		}else{
			propertiesIText.fontStyle = 'italic';
			$(this).addClass('active');
		}

		if(obj = canvas.getActiveObject()){
        	obj.fontStyle = propertiesIText.fontStyle;
        	canvas.renderAll();
        }
	});

	// Set image background canvas
	$('.background .picture-item').click(function(){
		var url = $(this).attr('src');
		var objCanvas = new Canvas(url, undefined);
		objCanvas.setBackground();
	});

	// Image filter
	$('.filter .picture-item').click(function(event) {
		var filterValue = $(this).attr('filter-value');
		if(filterValue != undefined){
			var imageFilter = new ImageFilter(filterValue);
			imageFilter.setFilter();
		}
	});


	var img = null;
	//Drag clipart image
	var dragType = 1;

	//Drag picture Clipart
	$('.clipart .picture-item').draggable({
		 helper:'clone',
		 zIndex:100,
		 drag: function(event, ui){

		 	dragType = 1;
		 	img = new ImageObj();
		 	var url = $(this).attr('src');

		 	img.url = url;
			 	// img.width = $(this).get(0).naturalWidth;
			 	// img.height = $(this).get(0).naturalHeight;
		 	img.width = parseInt($(this).width());
		 	img.height = parseInt($(this).height());
		 }
	});

	//Drag iText
	$('.text').draggable({
		 helper:'clone',
		 zIndex:100,
		 drag: function(event, ui){

		 	dragType = 2;
		 	propertiesIText.width = $(this).width();
		 	propertiesIText.height = $(this).height();
		 }
	});

	var mask = null;

	//Drag mask
	$('.mask .picture-item').draggable({
		helper: 'clone',
		zIndex: 1000,
		drag: function(event, ui){
			dragType = 3;

			mask = new Mask();
		 	var url = $(this).attr('src');

		 	mask.url = url;
			 	//mask.width = $(this).get(0).naturalWidth;
			 	// mask.height = $(this).get(0).naturalHeight;
		 	mask.width = parseInt($(this).width());
		 	mask.height = parseInt($(this).height());
		}
	});

	//Drag image has been updated
	$('.upload img').draggable({
		helper: 'clone',
		zIndex: 1000,
		drag: function(event, ui){

			dragType = 1;

			img = new ImageObj();
		 	var url = $(this).attr('src');


		 	img.url = url;
			var ratio = $(this).get(0).naturalWidth / $(this).get(0).naturalHeight;
			//img.height = $(this).get(0).naturalHeight;
		 	
		 	img.height = parseInt($(this).height());
		 	img.width = parseInt($(this).height() * ratio);

		}
	});

	$('#canvas').droppable({
		drop: function(event, ui){
			if(dragType === 1){

				//Drop clip art
				var x = parseInt(ui.offset.left - offsetX);
				var y = parseInt(ui.offset.top - offsetY);
				if(x < 0){
					x = 0;
				}

				if(y < 0){
					y = 0;
				}

				img.x = x;
				img.y = y;

				img.draw();
			}
			
			if(dragType === 2){

				//Drop iText
				var x = parseInt(ui.offset.left - offsetX);
				var y = parseInt(ui.offset.top - offsetY);
				console.log('UI left: ' + ui.offset.left);
				console.log('offsetXL ' + offsetX);
				console.log('Start x: ' + x);

				x = x + parseInt(propertiesIText.width/4);
				y = y + parseInt(propertiesIText.height/4);
				if(x < 0){
					x = 0;
				}

				if(y < 0){
					y = 0;
				}

				var iText = new IText('text', x, y, propertiesIText.fontFamily, propertiesIText.fontSize, propertiesIText.fill, propertiesIText.fontStyle, propertiesIText.fontWeight);
				iText.draw();
			}

			if(dragType === 3){

				//Drop mask
				var x = parseInt(ui.offset.left - offsetX);
				var y = parseInt(ui.offset.top - offsetY);
				if(x < 0){
					x = 0;
				}

				if(y < 0){
					y = 0;
				}

				mask.x = x;
				mask.y = y;

				mask.draw();
			}
		}
	});
});

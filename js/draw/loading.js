$( document ).ready(function() {
	
	$('[data-toggle="tooltip"]').tooltip();
	//load images clipart
	loadContent('.clipart', 'json/clipart.json');

	// //load images background
	loadContent('.background', 'json/background.json');

	// //load images frame
	loadContent('.frame', 'json/frame.json');

	// //load images mask
	loadContent('.mask', 'json/mask.json');

	//Load images filters
	$.ajax({
		url : 'json/filter.json',
		dataType: 'text',
		type: 'GET',
		async: false, 
		success: function(jsonStr){
			var json = $.parseJSON(jsonStr);
			var data ={
				arr: json.data
			};

			$('.filter').html('');
			var template = '';
			template += '{{~it.arr :value:index}}'
							+ '<img src="{{=value.img}}" filter-value="{{=value.filter}}" class="picture-item" />'
							+ '{{~}}';
			template += '<div class="clearfix"></div>';
			var tmpl = doT.template(template);
			var text = tmpl(data);
			$('.filter').html(text);
		}
	});

	//Load fonts
	$.ajax({
		url :'json/fonts.json',
		dataType: 'text',
		type: 'GET',
		async: false,
		success: function(jsonStr){
			var json = $.parseJSON(jsonStr);
			var data = {
				arr: json.data
			}

			$('.select-font').html('');
			var template = '';
			template += '{{~it.arr :value:index}}'
					+ '<option value="{{=value.value}}" style="font-family: ' + '{{=value.value}}' + ';">{{=value.value}}</option>'
					+ '{{~}}';

			var tmpl = doT.template(template);
			var text = tmpl(data);
			$('.select-font').html(text);
		}
	});

	$('.draw-item .select').change(function(){
		var $this = $(this);
		var str = "";
    	$($this).find( "option:selected" ).each(function() {
	      	str = $( this ).val();
	    });
	    var eleNext = $(this).next();
	    
	    $(eleNext).find('.picture-item').each(function(){
	    	var option = $(this).attr('option-select');
	    	if(option === str){
	    		$(this).show();
	    	}else{
	    		$(this).hide();
	    	}
	    });
	});

	$('.draw-item .option_name').click(function(){

		if($(this).hasClass('active')){
			$(this).removeClass('active')
			$(this).parent().find('.draw-picture').slideToggle(1500);
		}else{
			$(this).addClass('active')
			$(this).parent().find('.draw-picture').slideToggle(1500);
		}
	});


	function loadContent(ele, url){
		$.ajax({
		url : url,
		dataType: 'text',
		type: 'GET',
		async: false, 
		success: function(jsonStr){
			var json = $.parseJSON(jsonStr);

			var data ={
				arr: json.data
			};

			$(ele).html('');
			var template = '';
			var optionSelected = $(ele).prev().find('option:selected').val();

			template += '{{~it.arr :value:index}}'
							+ '{{?value.option === "' + optionSelected + '"}}'
							+ '<img src="{{=value.img}}" option-select="{{=value.option}}" class="picture-item" />'
							+ '{{??}}'
							+ '<img src="{{=value.img}}" option-select="{{=value.option}}" class="picture-item" style="display:none;"/>'
							+ '{{?}}'
							+ '{{~}}';
			template += '<div class="clearfix"></div>';
			var tmpl = doT.template(template);
			var text = tmpl(data);
			$(ele).html(text);
		}
	});

	}
});
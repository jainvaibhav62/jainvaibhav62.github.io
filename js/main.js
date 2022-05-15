(function ($) {
 "use strict";




/*
 ISOTOPE ACTIVE
================================ */

	// isotope menu
	var ProjMli = $('.portfolio-menu li');
	var ProjGrid = $('.portfolio-grid');
	ProjMli.on('click', function(){
	ProjMli.removeClass("active");
	  $(this).addClass("active");
		var selector = $(this).attr('data-filter');
		ProjGrid.isotope({
			filter: selector,
			animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false,
			}
		});
	});

/*
 fancybox Popup
================================ */
	$('.fancybox').fancybox({
		openEffect: 'fade',
		closeEffect: 'fade',
        padding : 0,

		closeBtn: true,

		helpers: {
			title: {
				type: 'inside'
			},
			buttons: {}
		},
		helpers: {
			overlay: {
			  locked: false
			}
		}
    });
	/* youtube video popup
	--------------------*/
	$(".various").fancybox({
		'padding' : 0,
		maxWidth    : 800,
		maxHeight   : 600,
		fitToView   : false,
		width       : '70%',
		height      : '70%',
		autoSize    : false,
		closeClick  : false,
		openEffect  : 'fade',
		closeEffect : 'fade'
	});






})(jQuery);

/*
	LODING BAR
================================ */

jQuery(window).on('load', function(){

	//Preloader
	var preeLoad = $('#loading');
	preeLoad.fadeOut(1000);

	// isotope grid
	var IsoGriddoload = $('.portfolio-grid');
	IsoGriddoload.isotope({
		itemSelector: '.grid-item',
		masonryHorizontal: {
			rowHeight: 100
		}
	});
});

//$(window).ready(function(){
	$('audio').mediaelementplayer({
	    flashName: 'assets/modules/audio/flash/flashmediaelement.swf',
	    silverlightName: 'assets/modules/audio/flash/silverlightmediaelement.xap',
	    features: ['playpause', 'progress', 'current','duration']

	});
	// HTML FALLBACK
	$('.me-cannotplay').parent().parent().parent().parent().find('.media-controls').css('display','block');
	$('.me-cannotplay').parent().parent().parent().css('display', 'none');
//});
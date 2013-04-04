
$('audio').mediaelementplayer({
    flashName: '/flash/flashmediaelement.swf',
    silverlightName: '/flash/silverlightmediaelement.xap',
    features: ['playpause', 'progress', 'current','duration']

});
// HTML FALLBACK
$('.me-cannotplay').parent().parent().parent().parent().find('.media-controls').css('display','block');
$('.me-cannotplay').parent().parent().parent().css('display', 'none');

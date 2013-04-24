$('.nav-controls a').click(function(e){
	$(jQuery.browser.webkit ? "body": "html").animate({ scrollTop: 0 }, "slow");
	$('#main-nav-standard ul').toggleClass('open');
});
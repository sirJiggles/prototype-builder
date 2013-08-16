var appVars = {
    tablet: $(window).width() <= 750 ? true : false,
    mobile: $(window).width() <= 600 ? true : false,
    desktop: $(window).width() >= 960 ? true : false,
    largeScreen: $(window).width() >= 1530 ? true : false,
    resizeTimer: null,
    imagesSwapped : false
}

/*
 * Main javascript file
 * 
 * require any libraries using juicer
 * 
 * @depends vendor/jquery-1.8.2.min.js
 * @depends vendor/hammer.min.js
 * @depends app-functions.js
 INCLUDE PLUGINS
 INCLUDE MODULES
 */


$(window).ready(function () {
    
     // Generic resize function
    $(window).resize(function(){
        clearTimeout(appVars.resizeTimer);
        appVars.resizeTimer = setTimeout(resizeWindowCallback, 500);
    });

    // CUSTOM APP CODE HERE
    
});

$(window).load(function(){

    // External link class JS
    externalLinks();
});
/*
 * Main javascript file
 * 
 * require any libraries using juicer
 * 
 * @depends vendor/jquery-1.8.2.min.js
 * @depends vendor/hammer.min.js
 INCLUDE PLUGINS
 * 
 */


$(window).ready(function () {
    
    var appVars = {
        tablet: $(window).width() <= 700 ? true : false,
        mobile: $(window).width() <= 500 ? true : false,
        resizeTimer: null,
        imagesSwapped : false
    }
    
    
    // Run our app javascript first


    /* Import module specific javscript using juicer
     * 
     INCLUDE MODULES
     */

    function resizeWindowCallback(){
        appVars.tablet = $(window).width() <= 700 ? true : false;
        appVars.mobile = $(window).width() <= 500 ? true : false;

        if(!appVars.imagesSwapped && !appVars.mobile){
             $.each( $('img'), function(index, obj){
                if($(this).attr('data-high-res')){
                    $(this).attr('src', $(this).attr('data-high-res'));
                    appVars.imagesSwapped = true;
                }
            });
        }
    }

     // Generic resize function
    $(window).resize(function(){
        clearTimeout(appVars.resizeTimer);
        appVars.resizeTimer = setTimeout(resizeWindowCallback, 500);
    });
    
});

$(window).load(function(){
     // External link class JS
    $('a.ext, .ext a').each(function() {
        if ($(this).attr('title') !== undefined && $(this).attr('title') !== "") {
            var extTitle = $(this).attr('title');
            $(this).attr('title', extTitle + ' (opens in a new window)');
        } else {
            $(this).attr('title', 'This link will open in a new window');
        }
        }).bind({
            'click':function() { window.open($(this).attr('href')); return false; },
            'keypress':function(e) { if (e.keyCode == 13){window.open($(this).attr('href')); return false;} }
    });
});

var convertTableToList = function(table){

    var listString = '',
    dts = new Array(),
    dds = new Array(),
    titles = new Array(),
    className = '',
    colsCount = false,
    thead = ( $(table).find('thead').length > 0 ) ? true : false,
    tfoot = ( $(table).find('tfoot').length > 0 ) ? true : false;


    if (thead){
        $.each( $(table).find('thead th'), function(index, value){
            if( index > 0){
                var pushValue = !$(value).hasClass('ignore') ? $(value).html() : '';
                dts.push( pushValue );
            }
        });
    }

    $.each( $(table).find('tbody tr:not(.ignore)'), function(j, row){

        // if cols count not set, set it now
        colsCount = (!colsCount) ? $(row).find('td').length : colsCount;

        $.each( $(row).find('td'), function(i, td){
            if(i === 0){
                titles.push( $(td).html() );
                dds.push(new Array());
            }else{
                dds[j].push( $(td).html() );
            }
        });
    });
   
    for(var i = 0; i < titles.length; i ++){

        if(thead){
            listString += '<h3>'+titles[i]+'</h3>';
            listString += '<dl class="mobile-table-replace">';

            for(var j = 0; j < dts.length; j ++){ 
                className = (j % 2) ? ' class="odd"' : '';
                listString += '<dt'+className+'>'+dts[j]+'</dt>';
                listString += '<dd'+className+'>'+dds[i][j]+'</dd>';

            }

            listString += '</dl>';
        }else{
            listString += '<ul class="mobile-table-replace">';

            listString += '<li class="title">'+titles[i]+'</li>';

            for(var j = 0; j < colsCount-1; j ++){
                className = (j % 2) ? ' class="odd"' : '';
                listString += '<li'+className+'>'+dds[i][j]+'</li>';
            }

            listString += '</ul>';
        }
    }

    // Add the table footer if applicable
    if (tfoot){

        listString += '<dl class="mobile-table-replace foot">';

        $.each( $(table).find('tfoot tr'), function(j, row){
            listString += '<dt>' + $(row).find('th').html() + '</dt>';
            listString += '<dd>' + $(row).find('td').html() + '</dd>';

        });

        listString += '</dl>';
    }



    $(table).replaceWith(listString);

}

/* Supports function for js fallback on css3 animations */
var supports = (function(prop) {  
  
    var vendors = 'ms O Moz Webkit'.split(' ');
    
    // check for standard support
    if ( prop in document.documentElement.style ) return true;  

    //check for cammal case one word support
    var propParts = prop.split('-');
    var propCamel = propParts[0];
    for(var i=1,len=propParts.length; i<len; i++){
        propCamel += propParts[i].replace(/^[a-z]/, function(val) {  
            return val.toUpperCase();  
        });
    };
    
    if ( propCamel in document.documentElement.style ) return true;
   
    
    prop = prop.replace(/^[a-z]/, function(val) {  
        return val.toUpperCase();  
    });
    
    var len = vendors.length;
    
    while(len--) {  
        if ( vendors[len] + prop in document.documentElement.style ) {  
            return true;
        }  
    } 
    return false;  

});


function isTouchDevice() {

    if ("ontouchstart" in document.documentElement)
    {
      return true;
    }
    else
    {
      return false;
    }
}
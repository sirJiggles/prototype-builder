/*
 * Main javascript file
 * 
 * require any libraries using juicer
 * 
 * @depends vendor/jquery-1.8.2.min.js
 * @depends vendor/hammer.min.js
 * @depends ../modules/jquery-ui/js/script.js
 * 
 */


$(window).ready(function () {
    
    
    $('html').removeClass('no-js');
    
    
    // Run our app javascript first
    
    $('.tools-link').click(function(e){
        e.preventDefault();
        $('#tools').toggleClass('active');
    });
    
   
    $('.main').nestedSortable({
        forcePlaceholderSize: true,
        placeholder: 'placeholder',
        tabSize: 25,
        tolerance: 'pointer',
        opacity: .6
    });
    
    // click a grid link
    
    $('.grid-link').click(function(e){
        e.preventDefault();
        
        var gridObject = $('<li class="grid-box col span-1"><a href="#" class="dragger"></a><a class="end-toggle" href="" title="End class">&#58542;</a></li>');
        
        // add the col class to the grid obj
        $(gridObject).addClass($(this).attr('id'));
        
        // remove active class
        $('#tools').toggleClass('active');
        
        // add grid object to stage
        $('.main').append(gridObject);
        
        // remove all previous classes fomr gird boxes
        $('.grid-box').removeClass('prev-grid');
        $(gridObject).addClass('prev-grid');
        
        
        // adding end class to grid containers
        $(gridObject).find('.end-toggle').click(function(e){
            e.preventDefault();
            $(gridObject).toggleClass('end');
        });
        
    });
    
    
    // click to add a module 
    $('.modules li a').click(function(e){
        
        var moduleObject = $('<li class="module-box"><a href="#" class="dragger"></a><div>'+$(this).parent().find('code').html()+'</div></li>');
        $('.main').append(moduleObject);
        
    });
    
    /* Import module specific javscript using juicer
     * 
     */
    
});



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
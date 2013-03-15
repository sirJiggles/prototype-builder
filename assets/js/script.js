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
    
   
    
    
    // click a grid link
    
    $('.grid-link').click(function(e){
        e.preventDefault();
        
        var gridObject = $('<div class="grid-box col span-1"><a href="#" class="dragger"></a><a href="#" class="done">Done</a><a href="#" class="edit">Edit</a></div>');
        
        $(gridObject).addClass($(this).attr('id'));
        
        
        $('#tools').toggleClass('active');
        
        if($('.prev-grid').length > 0){
            $('.prev-grid').append(gridObject);
        }else{
            $('.main').append(gridObject);
        }
        
        // remove all previous classes fomr gird boxes
        $('.grid-box').removeClass('prev-grid');
        $(gridObject).addClass('prev-grid');
        
        $(gridObject).draggable({
            handle: '.dragger',
            containment: "parent",
            snap: true
        });
        
        // add done and edit actions for new box
        $(gridObject).find('.done').click(function(e){
            e.preventDefault();
            $(gridObject).draggable("disable");
        });
        
        $(gridObject).find('.edit').click(function(e){
            e.preventDefault();
            $(gridObject).draggable("enable");
        })
        
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
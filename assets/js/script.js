/*
 * Main javascript file
 * 
 * require any libraries using juicer
 * 
 * @depends vendor/jquery-1.8.2.min.js
 * @depends vendor/hammer.min.js
 * @depends ../modules/jquery-ui/js/script.js
 * @depends vendor/nested-sortable.js
 * 
 * 
 */


$(window).ready(function () {
    
    
    $('html').removeClass('no-js');
    
    
    // Run our app javascript first
    
    $('.tools-link').click(function(e){
        e.preventDefault();
        $('.tools').toggleClass('active');
    });
    
   
    $('.main').nestedSortable({
        forcePlaceholderSize: true,
        placeholder: 'placeholder',
        tabSize: 25,
        tolerance: 'pointer',
        opacity: .6,
        handle: 'a.dragger'
    });
    
    // close popup
    $('.overlay').click(function(){
        hidePopup();
    });

    $('.popup a.close-button').click(function(e){
        e.preventDefault();
        hidePopup();
    });
    
    // click a grid link
    
    $('.grid-link').click(function(e){
        e.preventDefault();
        
        var gridObject = $('<li class="grid-box col span-1 unlocked">'+
                            '<a href="#" class="dragger control">&#9871;</a>'+
                            '<a class="settings control" href="#" title="click here to edit this box">&#9881;</a>'+
                            '<a class="lock control" href="#" title="click here to lock this box">&#128274;</a>'+
                            '<a class="unlock control" href="#" title="click here to unclock this box">&#128275;</a>'+
                            '<a class="end-toggle control" href="#" title="End class">&#58542;</a>'+
                            '<a class="remove control" href="#" title="Remove Item">&#10060;</a>'+
                            '<div class="text-label-proto-builder"></div></li>');
        
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
        
        // removing the grid element from the stage
        $(gridObject).find('.remove').click(function(e){
            e.preventDefault();
            $(gridObject).remove();
        });
        
        //click to view the settings for the grid box
        $(gridObject).find('.settings').click(function(e){
            e.preventDefault();
            $('.popup').show();
            $('.overlay').show();
            $(gridObject).addClass('editing');

            // set the values of the form based on the box we are editing
            if($(gridObject).hasClass('end')){
                $('#popup-grid-end').attr('checked', 'checked');
            }else{
                $('#popup-grid-end').attr('checked', false);
            }

            $('#popup-grid-text').val($(gridObject).find('.text-label-proto-builder').text());

            $('#popup-grid-size option').each(function(key, val){
                if($(gridObject).hasClass(this.value)){
                    $('#popup-grid-size option[value="'+this.value+'"]').attr("selected", "selected");
                }
            });

        });
        
        // lock / unlock button click
        $(gridObject).find('.lock').click(function(e){
            e.preventDefault();
            $(gridObject).removeClass('unlocked');
        });
        
        $(gridObject).find('.unlock').click(function(e){
            e.preventDefault();
            $(gridObject).addClass('unlocked');
        });
        
    });
    
    
    // click to add a module 
    $('.modules li a').click(function(e){
        
        var moduleObject = $('<div class="module-box">'+$(this).parent().find('code').html()+'</div>');
        
        // put the module in the last grid class added to the page
        
        $('.grid-box').last().append(moduleObject);
        
    });

    // Click save on the grid popup box
    $('#save-grid-box').click(function(e){

        e.preventDefault();
        // remove old grid size classes and add new ones
        $('.grid-link').each(function(){
            $('.editing').removeClass($(this).attr('id'));
        });

        //console.log($('#popup-grid-size option:selected')[0].value);

        $('.editing').addClass($('#popup-grid-size option:selected')[0].value);

        // set text for the 'editing box'
        $('.editing .text-label-proto-builder').text($('#popup-grid-text').val());

        // set end class if needed
        if($('#popup-grid-end').checked){
            $('.editing').addClass('end');
        }else{
            $('.editing').removeClass('end');
        }
        
        hidePopup();
    })
    
    
    
});

// Function to hide the popup (done in multiple places)
function hidePopup(){
    $('.popup').hide();
    $('.overlay').hide();
    $('.editing').removeClass('editing');
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
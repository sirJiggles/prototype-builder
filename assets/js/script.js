/*
 * Main javascript file
 * 
 * require any libraries using juicer
 * 
 * @depends vendor/jquery-1.8.2.min.js
 * @depends vendor/hammer.min.js
 * @depends ../modules/jquery-ui/js/script.js
 * @depends vendor/nested-sortable.js
 */

// Global variables
var global = {
    gridIdent:0,
    templates:{},
    currentTemplate:'',
    navigation:'standard'
}, fileSystem = '';


var swipeEvent = {
    applyToElement: function(element, options) {
        // catch
        if(!options){return;}
        if($(element).length == 0){return;}

        // set some vars and some defaults (overidable in options)
        var speed = 400,
        difference = $(window).width() / 3,
        debug = false,
        startX = null,
        startTouchTime = null,
        touchCompletionTime = null;

        $(element).bind('touchstart', function(e){
            e = getTouchEvent(e);
            startTouchTime = new Date();
            startX = e.pageX;
        });

        $(element).bind('touchend', function(e){
            e = getTouchEvent(e);
            touchCompletionTime = new Date() - startTouchTime;

            if(debug){
                console.log('completion time: '+touchCompletionTime);
                console.log('startX: '+startX);
                console.log('endX: '+e.pageX);
                console.log('difference: '+Math.abs(startX - e.pageX));
                console.log('speed setting: '+speed);
            };

            // if fast enough for swipe
            if(touchCompletionTime < speed){
                // if the distance moved is enough to warent swipe
                if(Math.abs(startX - e.pageX) > difference){
                    options.callback();
                }
            }
        });
    }
}

// Get touch event helper function
var getTouchEvent = function(e){
    if (e.originalEvent.touches && e.originalEvent.touches.length) {
        e = e.originalEvent.touches[0];
    } else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
        e = e.originalEvent.changedTouches[0];
    }   
    return e;
}



$(window).ready(function () {
    
    
    var appVars = {
        tablet: $(window).width() <= 700 ? true : false,
        mobile: $(window).width() <= 500 ? true : false,
        resizeTimer: null,
        imagesSwapped : false
    }

    
    
    // Run our app javascript first
    
    // ask for permission to store data on the file system (5MB)
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, initFileSystem, fileSystemErrorHandler);
    }, function(e) {
        console.log('Error', e);
    });

    // clicking on tools link 
    $('.tools-link').click(function(e){
        e.preventDefault();
        $('.tools').toggleClass('active');
    });
    
    // Removing the project
    $('.clear-store').click(function(e){
        e.preventDefault();
        $('.project-delete').show();
        $('.overlay').show();
    });

    $('.delete-project').click(function(e){
        e.preventDefault();
        updateStore(true, false);
        hidePopup();
    });

    $('.cancel-delete').click(function(e){
        e.preventDefault();
        hidePopup();
    });

    
    // create nested sortables, on chnage we call the update store function
    $('.main').nestedSortable({
        forcePlaceholderSize: true,
        placeholder: 'placeholder',
        tabSize: 25,
        tolerance: 'pointer',
        opacity: .6,
        handle: 'a.dragger',
        maxLevels:1,
        update: function(){
            updatePosition();
        }
    });
    
    // close popups
    $('.overlay').click(function(){
        hidePopup();
    });

    $('.popup a.close-button').click(function(e){
        e.preventDefault();
        hidePopup();
    });
    
    // click a grid button click
    $('#grid-select').change(function(e){

        e.preventDefault();

        if($(this).val() == 'select-grid') return;
        if($('.main').hasClass('lock')) return;
        

        $('.grid-box').removeClass('grid-active');
            
        addGridObjectToStage($(this).val(), global.gridIdent);
        
        // add item to grid store
        global.templates[global.currentTemplate].grid[global.gridIdent] = {
                                            size:$(this).val(),
                                            end:0,
                                            text:'',
                                            modules:[]
                                        };
                                            
        global.templates[global.currentTemplate].positions.push(global.gridIdent);
        
        //increment the grid ref var
        global.gridIdent ++;

        // reset the value of the select box
        $(this).val('Select Grid Box');
        
        updateStore(false);

            
    });
    
    // click to add a module 
    $('#module-select').change(function(e){
        
        e.preventDefault();
        
        // make sure its not the default one (should never happen)
        if($(this).val() != 'select-module'){

            // if we have an acrive grid element on the page
            if ($('.grid-active').length > 0){

                var moduleName = $(this).val();
                var moduleObject = $('<div class="module-box">'+$('#code-'+moduleName).html()+'</div>');
                
                // put the module in the last grid class added to the page
                $('.grid-active').append(moduleObject);
                
                //set the module name in the global data store
                global.templates[global.currentTemplate].grid[getGridId($('.grid-active'))].modules.push(moduleName);

                updateStore(true);
            }
        }
        
    });

    // Select a new navigation style
    $('#nav-select').change(function(e){
        e.preventDefault();
        // if the user wishes to use a different nav
        if ($(this).val() != global.navigation && $(this).val() != 'select-nav'){
            global.navigation = $(this).val();
            updateStore(true);
        }

    })


    // Click save on the grid popup box
    $('#save-grid-box').click(function(e){

        e.preventDefault();
        // remove old grid size classes and add new ones
        $("#grid-select > option").each(function() {
            $('.editing').removeClass($(this).attr('id'));
        });
        
        var thisID = getGridId($('.editing')),
            selectedSize = $('#popup-grid-size option:selected')[0].value;

        $('.editing').addClass(selectedSize);
        
        global.templates[global.currentTemplate].grid[thisID].size = selectedSize;
        
        // set text for the 'editing box'
        $('.editing .text-label-proto-builder').text($('#popup-grid-text').val());
        global.templates[global.currentTemplate].grid[thisID].text = $('#popup-grid-text').val();

        // set end class if needed
        if($('#popup-grid-end').is(':checked')){
            $('.editing').addClass('end');
            global.templates[global.currentTemplate].grid[thisID].end = true;
        }else{
            $('.editing').removeClass('end');
            global.templates[global.currentTemplate].grid[thisID].end = false;
        }

        hidePopup();
        
        updateStore(false);
    });

    // Template crud operations baby!

    // save form click (edit template)
    $('#edit-template-button').click(function(e){
        e.preventDefault();

        var newTemplateName = $('#popup-template-name').val();

        if (newTemplateName != global.currentTemplate){
            //create vopy of template
            global.templates[newTemplateName] = global.templates[global.currentTemplate];
            delete global.templates[global.currentTemplate];
            global.currentTemplate = newTemplateName;

            updateStore(true);
        }

    });

    // Download project functionality
    $('.download-project').click(function(e){
        e.preventDefault();

        // post the hidden form with the json data in it
        $('#data').val(JSON.stringify(global));
        $('#data-form').submit();
    });

    // lock / unlocking the template
    $('.lock-template').click(function(e){
        $('.main').toggleClass('lock');
        if ($('.main').hasClass('lock')){
            global.templates[global.currentTemplate].lock = true;
        }else{
            global.templates[global.currentTemplate].lock = false;
        }
        updateStore(false);
    });

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

// Function to update the lost of templates the user can choose
function updateTemplateList(){
    var templateListString = '';
    for(var template in global.templates){
        if (global.templates.hasOwnProperty(template)){
            templateListString += '<li' ;

            // If the active template we will add our controls to the tab
            if(template == global.currentTemplate){
                templateListString += ' class="active">';
                templateListString += '<a href="#" title="Click here to edit the template" class="edit-template">Rename Template</a>';
                templateListString += '<a class="template-item" href="#" title="Click here to select the template">'+template+'</a>';
                templateListString += '<a href="#" title="Click to delete current template" class="delete-template">Delete Template</a>';
                templateListString += '</li>';

                
            }else{
                templateListString += '><a class="template-item" href="#" title="Click here to select the template">'+template+'</a></li>';
            }

            
        }
    }

    // add the add new template button to the end
    templateListString += '<li class="new-template-li"><a href="#" title="Click to create a new template" class="new-template">New Template</a></li>';

    $('.template-tabs').html(templateListString);

    $('.edit-template').unbind('click');
    $('.new-template').unbind('click');
    $('.delete-template').unbind('click');

    //bind and unbind the template controls
    // click to view the popup for editing template
    $('.edit-template').click(function(e){
        e.preventDefault();
        // populate the text input with the name of the template
        $('#popup-template-name').val(global.currentTemplate);
        $('.popup.template-edit').show();
        $('.overlay').show();
    });

    // New template functionality
    $('.new-template').click(function(e){
        e.preventDefault();

        // create the new template name based on the size of the templates array
        var newTemplateName = 'template-' + (Object.keys(global.templates).length + 1);
        global.templates[newTemplateName] = {grid:{}, positions:[], locked:false};
        global.gridIdent = 0;
        global.currentTemplate = newTemplateName;

        // remove all elements from the stage
        $('.main').html('');

        // update local data
        updateStore(true);
       
    })

    // Delete template functionality
    $('.delete-template').click(function(e){
        e.preventDefault();
        // can only apply this if this is not the only template, sanity check first
        var templates = [], currentIndex = 0, i = 0;
        for(var prop in global.templates){
            if(global.templates.hasOwnProperty(prop)){
                templates.push(prop);
                if(prop == global.currentTemplate){
                    currentIndex = i;
                }
                i ++;
            }
        }
        if(templates.length > 1){

            delete global.templates[global.currentTemplate];

            if(typeof templates[currentIndex -1] !== 'undefined'){
                global.currentTemplate = templates[currentIndex -1];
            }else{
                // use the next template
                global.currentTemplate = templates[currentIndex +1];
            }

            updateStore(true);

        }else{
            alert ('Cannot remove the only template you have!');
        }

    });


}

// Function to apply the global.currentTemplate to stage
function loadTemplate(){

    // clear stage
    $('.main').html('');

    // re-calculate the value of gird ident
    var gridCount = 0, allModules = [];

    for(var prop in global.templates[global.currentTemplate].grid){
        if (global.templates[global.currentTemplate].grid.hasOwnProperty(prop)){
            gridCount ++;
        }
    }
    
    global.gridIdent = gridCount;

    if(global.templates[global.currentTemplate].lock){
        $('.main').addClass('lock');
    }

    $.each(global.templates[global.currentTemplate].positions, function(key, gridId){
        // add grid objects to the stage
        addGridObjectToStage(global.templates[global.currentTemplate].grid[gridId].size, gridId);

        // end classes
        if(global.templates[global.currentTemplate].grid[gridId].end){
            $('#grid-ident-'+gridId).addClass('end');
        }

        // adding modules to the grid items
        if(global.templates[global.currentTemplate].grid[gridId].modules.length > 0){
            // loop through all the modules in this grid object and add them
            $.each(global.templates[global.currentTemplate].grid[gridId].modules, function(moduleKey, moduleName){
                // if the module is availible
                if ($('#'+moduleName).length > 0){
                    var moduleObject = $('<div class="module-box">'+$('#code-'+moduleName).html()+'</div>');
                    $('#grid-ident-'+gridId).append(moduleObject);
                    if( $.inArray(moduleName, allModules)){
                        allModules.push(moduleName);
                    }
                }
            });
        }

    });

    // now we have a list of all modules we get the js files for the modules we need it for
    $.each(allModules, function(key, val){

        // insert the js for the moudles into the page (if there is a script file that is)
        $.ajax({
            url: "/assets/modules/"+val+"/js/script.js",
            type: "GET",
            dataType: "script"
        }); 
    });

    // get the js for the navigation for the project
    $.ajax({
        url: "/assets/navigation/"+global.navigation+"/js/script.js",
        type: "GET",
        dataType: "script"
    });

    // add the navigation HTML to the page
    $('#nav-header').html($('#code-'+global.navigation).html()); 

    // set active item
    $('.grid-box').removeClass('grid-active');
    $('.grid-box').eq(0).addClass('grid-active');

    // load up all the templates on the list
    updateTemplateList();

    // Change template functionality
    $('.template-item').click(function(e){
        e.preventDefault();
        global.currentTemplate = $(this).text();
        // update and reload page
        updateStore(true);
    });

}

// This function adds grid objects to the stage
function addGridObjectToStage(type, id){
    
    var gridText = (typeof global.templates[global.currentTemplate].grid[id] !== 'undefined') ? global.templates[global.currentTemplate].grid[id].text : '';

    var gridObject = $('<li class="grid-box grid-active unlocked '+type+'" id="grid-ident-'+id+'">'+
                        '<a href="#" title="Click here to drag sort the grid box" class="dragger control">Drag box</a>'+
                        '<a class="settings control" href="#" title="Click here to edit the settings of this container">Edit container</a>'+
                        '<a class="end-toggle control" href="#" title="Click here to toggle the end class on this container">Toggle end class</a>'+
                        '<a class="remove control" href="#" title="Click here to remove item">Remove Item</a>'+
                        '<div class="text-label-proto-builder">'+gridText+'</div></li>');


    // add grid object to stage
    $('.main').append(gridObject);

    // remove all previous classes fomr gird boxes
    $('.grid-box').removeClass('prev-grid');
    $(gridObject).addClass('prev-grid');


    // adding end class to grid containers
    $(gridObject).find('.end-toggle').click(function(e){
        e.preventDefault();
        $(gridObject).toggleClass('end');
        var id = getGridId($(gridObject));
        if($(gridObject).hasClass('end')){
            global.templates[global.currentTemplate].grid[id].end = 1;
        }else{
            global.templates[global.currentTemplate].grid[id].end = 0;
        }
        
        updateStore(false);
    });

    // removing the grid element from the stage
    $(gridObject).find('.remove').click(function(e){
        e.preventDefault();
        //remove from the global store
        var id = getGridId($(gridObject));
        delete global.templates[global.currentTemplate].grid[id];
        $(gridObject).remove();
        updatePosition();
    });

    //click to view the settings for the grid box
    $(gridObject).find('.settings').click(function(e){
        e.preventDefault();
        $('.popup.grid-edit').show();
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

    //making the grid object the 'active' item
    $(gridObject).click(function(e){
        if($(this).hasClass('unlocked')){
            $('.grid-box').removeClass('grid-active');
            $(this).addClass('grid-active');
        }
    });
}


/*
 * attach file system events to elements on page
 */
function initFileSystem(fs){
    
    // store the file system in the global object
    fileSystem = fs;
    
    // get data from the store 
    loadFromStore();
   
}

// This is where we update the local file with the details of the grid
function updateStore(reload, write){
    
    if(typeof reload === 'undefined') var reload = false;
    if(typeof write === 'undefined') var write = true;

    var string = JSON.stringify(global);

    // get the file and truncate the contents of it (effectively wipe contents of file) 
    fileSystem.root.getFile('prototype-builder.json', {}, function(fileEntry) {
        
        fileEntry.createWriter(function(fileWiper) {
            fileWiper.truncate(0);

            // once we are finished we will add new data to file
            fileWiper.onwriteend = function(e) {

                // if we want to write to the file again
                if(write){
                    fileEntry.createWriter(function(fileWriter) {

                        var blob = new Blob([string], {type: 'text/json'});
                        fileWriter.write(blob);

                        // if we need to reload the page after the store has been updated 
                        if(reload){
                            fileWriter.onwriteend = function(e) {
                                location.reload();
                            };
                        }

                    }, fileSystemErrorHandler);
                }else{
                    if(reload){
                        location.reload();
                    }
                }

            };

        }, fileSystemErrorHandler);
        
    }, fileSystemErrorHandler);
    
}


function loadFromStore(){
    
    fileSystem.root.getFile('prototype-builder.json', {}, function(fileEntry) {
  
        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function(file) {
            var reader = new FileReader();

            reader.onloadend = function(e) {
                
                if (this.result && this.result != ''){
                    // using the data provided create the grid and the global store
                    global = JSON.parse(this.result);
                    loadTemplate();
                }else{
                    settupDefaultTemplate();
                }
                             
           };

           reader.readAsText(file);
        }, fileSystemErrorHandler);

    }, function(){

        // file must not exist, create it here
        fileSystem.root.getFile('prototype-builder.json', {create:true}, function(fileEntry) {
        });

        settupDefaultTemplate();
   
    });
}

function settupDefaultTemplate(){
    global.templates = {'template-one' : {grid:{}, positions:[]}};
    global.currentTemplate = 'template-one';
    $('#nav-header').html($('#code-'+global.navigation).html());
}

/* 
 * File system error handling
 */
function fileSystemErrorHandler(e){
    var msg = 'An file system error occured: ';
 
    switch (e.code) {
      case FileError.QUOTA_EXCEEDED_ERR:
        msg += 'QUOTA_EXCEEDED_ERR';
        break;
      case FileError.NOT_FOUND_ERR:
        msg += 'NOT_FOUND_ERR';
        break;
      case FileError.SECURITY_ERR:
        msg += 'SECURITY_ERR';
        break;
      case FileError.INVALID_MODIFICATION_ERR:
        msg += 'INVALID_MODIFICATION_ERR';
        break;
      case FileError.INVALID_STATE_ERR:
        msg += 'INVALID_STATE_ERR';
        break;
      default:
        msg += 'Unknown Error';
        break;
    };

 
    console.log(msg);
};

// utils function to update the position of elements on the page
function updatePosition(){
    
    var id = '', currentPositions = [];
    $.each($('.main li.grid-box'), function(key, val){
        id = getGridId($(this));
        currentPositions.push(id);
    });
    
    global.templates[global.currentTemplate].positions = currentPositions;
    
    // if all grid elements have been removed from this template
    // set the grid ident back to 0
    if(typeof global.templates[global.currentTemplate].positions[0] === 'undefined'){
        global.gridIdent = 0;
    }

    updateStore();

}

// utils function to  get the grid box id 
function getGridId(obj){
    return parseInt(obj.attr('id').replace('grid-ident-', ''));
}


// Function to hide the popup (done in multiple places)
function hidePopup(){
    $('.popup').hide();
    $('.overlay').hide();
    if($('.editing').length > 0){
        $('.editing').removeClass('editing');
    }
}

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
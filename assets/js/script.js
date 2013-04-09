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
 */

// Global variables
var global = {
        gridIdent:0,
        templates:{},
        currentTemplate:''
}, fileSystem = '';


$(window).ready(function () {
    
    
    $('html').removeClass('no-js');
    
    
    // Run our app javascript first
    
    // ask for permission to store data on the file system (5MB)
    window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
    window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, initFileSystem, fileSystemErrorHandler);
    }, function(e) {
        console.log('Error', e);
    });

     // if there is no template name set create the frst one using the default template name
    var hasTemplate = false;
    for(var prop in global.templates){
        if(global.templates.hasOwnProperty(prop)){
            hasTemplate = true;
            break;
        }
    }

    if(!hasTemplate){
        global.templates = {'template-one' : {grid:{}, positions:[]}};
        global.currentTemplate = 'template-one';
    }

    updateTemplateList();

    // clicking on tools link 
    $('.tools-link').click(function(e){
        e.preventDefault();
        $('.tools').toggleClass('active');
    });
    
    //clearing the local file on file system HTML5
    $('.clear-store').click(function(e){
        e.preventDefault();
        updateStore(true, false);
    })
    
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
    $('.grid-link').click(function(e){
        
        e.preventDefault();
        
        $('.grid-box').removeClass('grid-active');
        
        addGridObjectToStage($(this).attr('id'), global.gridIdent);
    
        // add item to grid store
        global.templates[global.currentTemplate].grid[global.gridIdent] = {
                                            size:$(this).attr('id'),
                                            end:0,
                                            text:'',
                                            modules:[]
                                        };
                                        
        global.templates[global.currentTemplate].positions.push(global.gridIdent);
        
        //increment the grid ref var
        global.gridIdent ++;
        
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

    // Click save on the grid popup box
    $('#save-grid-box').click(function(e){

        e.preventDefault();
        // remove old grid size classes and add new ones
        $('.grid-link').each(function(){
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

            updateStore(false);
        }

        hidePopup();
        updateTemplateList();

    });

    // click to view the popup for editing template
    $('.edit-template').click(function(e){
        e.preventDefault();
        // populate the text input with the name of the template
        $('#popup-template-name').val(global.currentTemplate);
        $('.popup.template-edit').show();
        $('.overlay').show();
        $('.tools').toggleClass('active');
    });

    // New template functionality
    $('.new-template').click(function(e){
        e.preventDefault();

        // create the new template name based on the size of the templates array
        var newTemplateName = 'template-' + (Object.keys(global.templates).length + 1);
        global.templates[newTemplateName] = {grid:{}, positions:[]};
        global.gridIdent = 0;
        global.currentTemplate = newTemplateName;

        // remove all elements from the stage
        $('.main').html('');

        // update local data
        updateStore(true);
       
    })

    // Change template functionality
    $('#select-template').change(function(e){
        e.preventDefault();
        global.currentTemplate = $(this).val();
        // update and reload page
        updateStore(true);
    });

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

        $('.tools').toggleClass('active');
    });

    // Download project functionality
    $('.download-project').click(function(e){
        e.preventDefault();

        // post the hidden form with the json data in it
        $('#data').val(JSON.stringify(global));
        $('#data-form').submit();

        // submit the post data to the download file
        /*$.ajax({  
            type: "POST",  
            url: "includes/download.inc.php",  
            data: 'data='+JSON.stringify(global),  
            success: function() {  
                
            }  
        });*/  
    })

});

// Function to update the lost of templates the user can choose
function updateTemplateList(){
    var optionString = '';
    for(var template in global.templates){
        if (global.templates.hasOwnProperty(template)){
            optionString += '<option value="' + template + '"';
            if(template == global.currentTemplate){
                optionString += ' selected="selected" ';
            }
            optionString += '>' + template + '</option>';
        }
    }
    $('#select-template').html(optionString);
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

    // set active item
    $('.grid-box').removeClass('grid-active');
    $('.grid-box').eq(0).addClass('grid-active');

    // load up all the templates on the list
    updateTemplateList();
}

// This function adds grid objects to the stage
function addGridObjectToStage(type, id){
    
    var gridObject = $('<li class="grid-box grid-active col span-1 unlocked" id="grid-ident-'+id+'">'+
                        '<a href="#" class="dragger control">&#9871;</a>'+
                        '<a class="settings control" href="#" title="click here to edit this box">&#9881;</a>'+
                        '<a class="lock control" href="#" title="click here to lock this box">&#128274;</a>'+
                        '<a class="unlock control" href="#" title="click here to unclock this box">&#128275;</a>'+
                        '<a class="end-toggle control" href="#" title="End class">&#58542;</a>'+
                        '<a class="remove control" href="#" title="Remove Item">&#10060;</a>'+
                        '<div class="text-label-proto-builder"></div></li>');

    // add the col class to the grid obj
    $(gridObject).addClass(type);

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

    // lock / unlock button click
    $(gridObject).find('.lock').click(function(e){
        e.preventDefault();
        $(gridObject).removeClass('unlocked');
    });

    $(gridObject).find('.unlock').click(function(e){
        e.preventDefault();
        $(gridObject).addClass('unlocked');
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
                
                // add to document for now (DEBUG)
                var txtArea = document.createElement('textarea');
                txtArea.value = this.result;
                document.body.appendChild(txtArea);



                if (this.result && this.result != ''){
                   // using the data provided create the grid and the global store
                   global = JSON.parse(this.result);

                   loadTemplate();
                }
             
           };

           reader.readAsText(file);
        }, fileSystemErrorHandler);

    }, function(){
        // file must not exist, create it here
        fileSystem.root.getFile('prototype-builder.json', {create:true}, function(fileEntry) {
        });
    });
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
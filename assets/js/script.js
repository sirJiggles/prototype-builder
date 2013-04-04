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

var global = {
        gridIdent:0,
        grid:{},
        positions:[]
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
        handle: 'a.dragger',
        maxLevels:1,
        update: function(){
            updatePosition();
        }
    });
    
    // close popup
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
        
        // hide the tools
        $('.tools').toggleClass('active');
        
        
        // add item to grid store
        global.grid[global.gridIdent] = {
                                            size:$(this).attr('id'),
                                            end:false,
                                            text:'',
                                            module:''
                                        };
                                        
        global.positions.push(global.gridIdent);
        
        //increment the grid ref var
        global.gridIdent ++;
        
        updateStore();
        
    });
    
    // click to add a module 
    $('.modules li a').click(function(e){
        
        e.preventDefault();
        
        var moduleObject = $('<div class="module-box">'+$(this).parent().find('code').html()+'</div>');
        
        
        // put the module in the last grid class added to the page
        $('.grid-active').append(moduleObject);
        
        //set the module name in the global data store
        global.grid[getGridId($('.grid-active'))].module = $(this).text;

         // hide the tools
        $('.tools').toggleClass('active');

        
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
        
        global.grid[thisID].size = selectedSize;
        
        // set text for the 'editing box'
        $('.editing .text-label-proto-builder').text($('#popup-grid-text').val());
        global.grid[thisID].text = $('#popup-grid-text').val();

        // set end class if needed
        if($('#popup-grid-end').is(':checked')){
            $('.editing').addClass('end');
            global.grid[thisID].end = true;
        }else{
            $('.editing').removeClass('end');
            global.grid[thisID].end = false;
        }

        hidePopup();
    });
    
});

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
            global.grid[id].end = true;
        }else{
            global.grid[id].end = false;
        }
    });

    // removing the grid element from the stage
    $(gridObject).find('.remove').click(function(e){
        e.preventDefault();
        //remove from the global store
        var id = getGridId($(gridObject));
        delete global.grid[id];
        $.each(global.positions, function(key, val){
            if (val == id){
                delete global.positions[key];
            }
        });

        $(gridObject).remove();

        updateStore();
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

        updateStore();

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
function updateStore(){
    
    var string = JSON.stringify(global);
    
    // attempt to get the file, if not found create it
    fileSystem.root.getFile('prototype-builder.json', {}, function(fileEntry) {
      
        fileEntry.createWriter(function(fileWriter) {
            
            // overide file
            //fileWriter.seek(fileWriter.length); // Start write position at EOF.
            var blob = new Blob([string], {type: 'text/json'});
            fileWriter.write(blob);

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
             var txtArea = document.createElement('textarea');
             txtArea.value = this.result;
             document.body.appendChild(txtArea);
             
             
             // using the data provided create the grid and the global store
             global = JSON.parse(this.result);
             
             
             $.each(global.positions, function(key, gridId){

                 // add grid objects to the stage
                 addGridObjectToStage(global.grid[gridId].size, gridId);
             });

             
           };

           reader.readAsText(file);
        }, fileSystemErrorHandler);

    }, function(){
        
        // create the file if not exists
        fileSystem.root.getFile('prototype-builder.json', {create: true, exclusive: true}, function(fileEntry) {
           // do nothing for now
        }, fileSystemErrorHandler);
        
        
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
    $.each($('.main li'), function(key, val){
        id = getGridId($(this));
        currentPositions.push(id);
    });
    
    global.positions = currentPositions;

}

// utils function to  get the grid box id 
function getGridId(obj){
    return parseInt(obj.attr('id').replace('grid-ident-', ''));
}


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
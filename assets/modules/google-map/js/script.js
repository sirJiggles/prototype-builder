if ($('#map-container').length > 0){
        
        
    var startLat = '-34.397';
    var startLon = '150.644';
    
    var mapOptions = {
        center: new google.maps.LatLng((parseInt(startLat) + 0.2), (parseInt(startLon) + 0.8)),
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl:false,
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.LEFT_CENTER
        }
    };
    var map = new google.maps.Map(document.getElementById("map-container"), mapOptions);
    
    // Custom marker icon

    var image = new google.maps.MarkerImage('/assets/modules/google-map/img/icon.png', new google.maps.Size(31, 38), new google.maps.Point(0,0), new google.maps.Point(0, 38));
    var shadow = new google.maps.MarkerImage('/assets/modules/google-map/img/icon-shadow.png', new google.maps.Size(31, 6),new google.maps.Point(0,0),new google.maps.Point(0, 3));
    
    var shape = {
      coord: [1, 1, 1, 38, 38, 31, 31 , 38, 38, 1],
      type: 'poly'
    };

    var myLatLng = new google.maps.LatLng(startLat, startLon);
    // create the marker
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        shadow: shadow,
        icon: image,
        shape: shape,
        title: 'Custom Marker Title'
    });
    
    // Set up the info window and the click event for the marker
    var infowindow = new google.maps.InfoWindow({
        content: " "
    });
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent('<div class="info-window"><h4>'+marker.title+'</h4>'+' <br />Street name<br />Town<br />City<br />Post Code</div>');
      infowindow.open(map, this);
    });


    // click events on directions
    $('.directions a.arrow-link').click(function(e){
        e.preventDefault();
        $(this).parent().find('.hidden-content').slideToggle();
        $(this).toggleClass('active');
        if($(this).hasClass('active')){
            $(this).html($(this).text().replace('Read all ', 'Show less ') + '<span></span>');
        }else{
            $(this).html($(this).text().replace('Show less ', 'Read all ') + '<span></span>');
        }
    })
   
    
} // end if on correct page
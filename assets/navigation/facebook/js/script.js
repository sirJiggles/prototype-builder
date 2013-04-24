/* facebook mobile navigation */ 
$('.nav-controls a').click(function(e){

    $('#main-nav-facebook ul').toggleClass('active');

    if( $('#main-nav-facebook ul').hasClass('active') ){
        hammer = new Hammer(document.getElementById("facebook-nav"));

        hammer.onswipe = function(event){
            if(event.direction == 'left'){
                $('.nav-controls a').click();
            }
        }
    }else{
        hammer.destroy();
    }

});
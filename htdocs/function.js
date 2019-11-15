//alert (window.navigator.userAgent)
$(function() {
    $.getJSON('http://worldtimeapi.org/api/timezone/america/bahia', function(data){
        apitime = new Date(data.datetime).getTime();
        conrodtime = new Date('2020-02-17').getTime();
        $('#relogio span').html(Math.floor ((conrodtime - apitime) / 86400000))
    });

    $('#inicio-sec').fadeIn().removeClass('hidden');

    $('header span').click(menuToggle);

    $('header nav a').click(function(event){
        if ($(event.target).hasClass('active') || 
            $(event.target).hasClass('disabled')) return;
    
        targetPage = '#' + $(event.target).attr('id') + '-sec';

        $('header nav a.active').removeClass('active');

        $(event.target).addClass('active');

        $('section:not(hidden)').fadeOut().addClass('hidden');

        $('html, body').scrollTop(0);
    
        $(targetPage).fadeIn().removeClass('hidden');

        menuToggle();
    });

});

/**
 * Exibe ou esconde o menu da aplicação.
 * @author laudivan
 * @returns
 */
function menuToggle () { 
    if ( $('header').hasClass('active') ) {
		$('header').removeClass('active');
	} else {
		$('header').addClass('active');
	}
}

var getDeviceType = function(){
    var ua = navigator.userAgent;
    var checker = {
      iphone: ua.match(/(iPhone|iPod|iPad)/),
      blackberry: ua.match(/BlackBerry/),
      android: ua.match(/Android/)
    };
    if (checker.android){
        return 'android';
    }
    else if (checker.iphone){
        return 'iphone';
    }
    else if (checker.blackberry){
        return 'blackberry';
    }
    else {
        return 'outro';
    }
}
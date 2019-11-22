const inscricaoSemDesconto = 75;

var inscricao = {};

// Your web app's Firebase configuration
project = firebase.initializeApp({
    apiKey: "AIzaSyCM3ofAPNlQIjElO8_fVuzEE2W_n2YvORQ",
    authDomain: "conrod-e7885.firebaseapp.com",
    databaseURL: "https://conrod-e7885.firebaseio.com",
    projectId: "conrod-e7885",
    storageBucket: "conrod-e7885.appspot.com",
    messagingSenderId: "6702416620",
    appId: "1:6702416620:web:2b7dd4c0606997b8f9dbc9",
    measurementId: "G-6DPLCGWTXG"
});

console.log(project.name);

project.analytics();
  
var db = project.firestore();

$(function() {
    $.getJSON('http://worldtimeapi.org/api/timezone/america/bahia', function(data){
        apitime = new Date(data.datetime).getTime();
        conrodtime = new Date('2020-02-17').getTime();
        $('#relogio span').html(Math.floor ((conrodtime - apitime) / 86400000))
    });

    $('section:not(#inicio-sec)').fadeIn().addClass('hidden');

    $('header span').click(menuToggle);

    $('header nav a').click(function(event){
        if ($(event.target).hasClass('active') || 
            $(event.target).hasClass('disabled')) return;
    
        targetPage = '#' + $(event.target).attr('id') + '-sec';

        $('header nav a.active').removeClass('active');

        $(event.target).addClass('active');

        goToPage(targetPage);

        menuToggle();

        if(targetPage == "#inscricao-sec") {
            somarKit();
        }
    });

    $('#finscricao input').change (validarInscricao);

    $('#finscricao').submit(setInscricao);

    $('#confirmacao-sec #cancelar').click (function(){
        goToPage('#inscricao-sec');
    });

    $('#confirmacao-sec #enviar').click (enviarInscricao);

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

function goToPage (targetPage) {
    $('section:not(hidden)').fadeOut().addClass('hidden');

    $('html, body').scrollTop(0);
    
    $(targetPage).fadeIn().removeClass('hidden');
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

function semKit () {
    $('#camisa, #copo, #pin').prop( "checked", false );
    somarKit();
}

function selKit() {
    $('#camisa, #copo, #pin').prop( "checked", true );
    somarKit();
}

function calcInsc () {

}

function validarInscricao () {
    $('select[name=tamanho').prop('disabled', ! $('input[name=camisa').prop('checked') );
    
    if (
        $('#nome').val().trim() != "" && 
        $('#email').val().trim() != ""
    ) {
        $('#enviar').prop('disabled', false);
    } else {
        $('#enviar').prop('disabled', true);
    }

    somarKit();
}

function somarKit () {
    kit = $('#finscricao fieldset input[type=checkbox], #finscricao fieldset input[type=hidden]').serializeArray();

    kitsum = kit.map(item => item.value).reduce((prev, next) => parseInt(prev) + parseInt(next));

    if (kitsum < inscricaoSemDesconto) {
        $('#resultado span').removeClass('comdesconto');
    } else {
        kitsum -= 10; 
        $('#resultado span').addClass('comdesconto'); 
    }

    $('#finscricao input[name=total]').attr ('value', kitsum);
    $('#resultado span').html('R$ ' + kitsum + ',00');

}

function setInscricao () {
    auxkit = [];

    if ($('#finscricao input[name=camisa]').prop('checked')) {
        auxkit.push('camisa');
        auxkit.push($('#finscricao select[name=tamanho]').val());
    }

    if ($('#finscricao input[name=copo]').prop('checked')) {
        auxkit.push('copo');
    }

    if ($('#finscricao input[name=pin]').prop('checked')) {
        auxkit.push('pin');
    }

    inscricao = {
        org: $('#finscricao select[name=org]').val(),
        tipo: $('#finscricao input[name=tipo]:checked').val(),
        sisdm: $('#finscricao input[name=sisdm]').val(),
        nome: $('#finscricao input[name=nome]').val(),
        email: $('#finscricao input[name=email]').val(),
        kit: auxkit,
        valor: $('#finscricao input[name=total]').val()
    }

    goToPage ('#confirmacao-sec');

    $('#confirmacao-sec #org').html(inscricao.org);
    $('#confirmacao-sec #tipo').html(inscricao.tipo);
    $('#confirmacao-sec #sisdm').html(inscricao.sisdm);
    $('#confirmacao-sec #nome').html(inscricao.nome);
    $('#confirmacao-sec #email').html(inscricao.email);
    $('#confirmacao-sec #kit').html(inscricao.kit.join(', '));
    $('#confirmacao-sec #valor').html('R$ ' + inscricao.valor + ',00');
    

    /*
    $.post('inscricaoconrod.php', {
        'authcode': 0,
        'inscricao': formData
    }, sucesso, 'json');
*/
    return false;
}

function sucesso (data, textStatus, jqXHR) {
    console.log('Teste');
}

function enviarInscricao () {
    inscricao.pago = false;

    db.collection(inscricao.tipo).doc(inscricao.email).set(inscricao)
    .then(function() {

        goToPage('#inscrefetuada-sec');

        $('#inscrefetuada-sec #valor').html('R$ ' + inscricao.valor + ',00');

        console.log("Document successfully written!");
    })
    .catch(function(error) {
        goToPage('#falhaNaInscricao-sec');

        console.error("Error writing document: ", error);
    });
}

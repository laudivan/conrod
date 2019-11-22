
var inscricaoSemDesconto = 0;
var inscricaoCONROD = 0;

var inscricao = {};

var db = firebase.firestore();

$(function() {
    getTime();

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

    $('#finscricao select, #finscricao input[type=radio], #finscricao input[type=checkbox]').change (validarInscricao);

    $('#finscricao #email, #finscricao #nome').keyup(validarInscricao);
        
    $('#finscricao').submit(setInscricao);

    $('#confirmacao-sec #cancelar').click (function(){
        goToPage('#inscricao-sec');
    });

    $('#confirmacao-sec #enviar').click (enviarInscricao);

    getLote();

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
        $('#nome').val().trim().length > 10 && 
        $('#email').val().trim().length > 10
    ) {
        db.collection('inscricoes').doc($('#email').val().trim()).get().then(function (doc){
            if (doc.exists) {
                $('#enviar').prop('disabled', true);
    
                $('#email').popover('show');
            } else {
                $('#enviar').prop('disabled', false);
    
                $('#email').popover('hide');
            }
        }).catch(function(error){
            $('#enviar').prop('disabled', false);

            console.log("Error getting document:", error);
        });
        
    } else {
        $('#enviar').prop('disabled', true);
    }

    somarKit();
}

function somarKit () {
    kit = $('#finscricao fieldset input[type=checkbox], #finscricao fieldset input[name=inscricao]').serializeArray();

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
        nome: $('#finscricao input[name=nome]').val().trim(),
        email: $('#finscricao input[name=email]').val().trim(),
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
    
    return false;
}

function sucesso (data, textStatus, jqXHR) {
    console.log('Teste');
}

function selectURLPagamento (valor) {
    var urlbank = [];

    urlbank[65] = {
        nubank: 'https://nubank.com.br/pagar/vq4f/VTekTTwm3y',
        inter: 'http://www.bancointer.com.br/interpag/002.2.8f460705-e1c5-4da2-bce4-dd85c54cc038.6500',
        picpay: 'https://picpay.me/vanlivre/65.0'
    };

    urlbank[55] = {
        nubank: 'https://nubank.com.br/pagar/vq4f/vgeHpppfyi',
        inter: 'http://www.bancointer.com.br/interpag/002.2.8f460705-e1c5-4da2-bce4-dd85c54cc038.5500',
        picpay: 'https://picpay.me/vanlivre/55.0'
    };

    urlbank[50] = {
        nubank: 'https://nubank.com.br/pagar/vq4f/SQj4jAivVK',
        inter: 'http://www.bancointer.com.br/interpag/002.2.8f460705-e1c5-4da2-bce4-dd85c54cc038.5000',
        picpay: 'https://picpay.me/vanlivre/50.0'
    };

    urlbank[40] = {
        nubank: 'https://nubank.com.br/pagar/vq4f/0FwMQiLBib',
        inter: 'http://www.bancointer.com.br/interpag/002.2.8f460705-e1c5-4da2-bce4-dd85c54cc038.4000',
        picpay: 'https://picpay.me/vanlivre/40.0'
    };

    urlbank[30] = {
        nubank: 'https://nubank.com.br/pagar/vq4f/OMotL5XMZV',
        inter: 'http://www.bancointer.com.br/interpag/002.2.8f460705-e1c5-4da2-bce4-dd85c54cc038.3000',
        picpay: 'https://picpay.me/vanlivre/30.0'
    };

    $('#inscrefetuada-sec #nubank').attr('href', urlbank[valor].nubank);
    //$('#inscrefetuada-sec #inter').attr('href', urlbank[valor].inter);
    $('#inscrefetuada-sec #picpay').attr('href', urlbank[valor].picpay);
}


function enviarInscricao () {
    inscricao.pago = false;
    inscricao.boleto = false;
    inscricao.time = firebase.firestore.Timestamp.now();

    db.collection('inscricoes').doc(inscricao.email).set(inscricao)
    .then(function() {

        goToPage('#inscrefetuada-sec');

        $('#inscrefetuada-sec #valor').html('R$ ' + inscricao.valor + ',00');

        selectURLPagamento (inscricao.valor);

        console.log("Document successfully written!");
    })
    .catch(function(error) {
        goToPage('#falhaNaInscricao-sec');

        console.error("Error writing document: ", error);
    });
}

function getTime () {
    apitime = new Date().getTime();
    conrodtime = new Date('2020-02-17').getTime();
    $('#relogio span').html(Math.floor ((conrodtime - apitime) / 86400000))
}

function existeEmail (email) {
    

}

function getLote () {
    agora = new Date().getTime();
    //agora = new Date('2019-12-22').getTime();
    inicio1lote = new Date('2019-11-22').getTime();
    inicio2lote = new Date('2019-12-21').getTime();
    fimDasInscricoes = new Date('2020-01-14').getTime();

    if ( agora < inicio1lote) {
        $('header #inscricao').html('Inscrições em breve');
    } else if ( agora < inicio2lote ) {
        $('header #inscricao').removeClass('disabled');
        $('header #inscricao').html('Inscrições (1º lote)');

        $('#inicio-sec #lotemsg').addClass('inscricoes_abertas').html('Estão abertas as inscrições do 1º lote (até 21 de dezembro).');

        inscricaoSemDesconto = 75;
        inscricaoCONROD = 30;

        $('#finscricao fieldset input[name=inscricao]').attr ('value', inscricaoCONROD);
    } else if ( agora < fimDasInscricoes ) {
        $('header #inscricao').removeClass('disabled');
        $('header #inscricao').html('Inscrições (2º lote)');

        $('#inicio-sec #lotemsg').addClass('inscricoes_abertas').html('Estão abertas as inscrições do 2º e último lote (até 14 de janeiro).');

        inscricaoSemDesconto = 85;
        inscricaoCONROD = 40;
        $('#finscricao fieldset input[name=inscricao]').attr ('value', inscricaoCONROD);
    } else {
        $('header #inscricao').addClass('disabled').html('Inscrições encerradas');

        $('#inicio-sec #lotemsg').addClass('inscricoes_encerradas').html('Inscrições encerradas');
        
    } 
}

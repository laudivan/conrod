
var inscricaoSemDesconto = 0;
var inscricaoCONROD = 0;

var inicio1lote = new Date('2019-11-22').getTime();
var inicio2lote = new Date('2020-01-01').getTime();
var fimDasInscricoes = new Date('2020-01-15').getTime();

var inscricao = {};

var db = null;

function initFirebase(persistent = false) {
    db = firebase.firestore()

    if (persistent) {
        db.enablePersistence()
        .catch(function(err) {
            console.log ('Ocorreu um erro: ' + err.code)
            
            if (err.code == 'failed-precondition') {
                // Multiple tabs open, persistence can only be enabled
                // in one tab at a a time.
                // ...
            } else if (err.code == 'unimplemented') {
                // The current browser does not support all of the
                // features required to enable persistence
                // ...
            }
        });
    }
}

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

/**
 * Muda para a página passada em @param
 * @param {*} targetPage 
 */
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

/**
 * Desmarca todos os itens do kit
 */
function semKit () {
    $('#camisa, #copo, #pin').prop( "checked", false );
    somarKit();
}

/**
 * Seleciona o kit completo
 */
function selKit() {
    $('#camisa, #copo, #pin').prop( "checked", true );
    somarKit();
}

/**
 * Valida a inscrição
 */
function validarInscricao () {
    $('select[name=tamanho').prop('disabled', ! $('input[name=camisa').prop('checked') );
    
    if (
        $('#nome').val().trim().length > 5 && 
        $('#email').val().trim().length > 10
    ) {
        
        db.collection('inscricoes').doc($('#email').val().trim()).get().then(function (doc){
            
            if (doc.exists) {
                $('#btSetInscricao').prop('disabled', true);
    
                $('#email').popover('show');
            } else {
                $('#btSetInscricao').prop('disabled', false);
    
                $('#email').popover('hide');
            }
        }).catch(function(error){
            $('#btSetInscricao').prop('disabled', false);

            console.log("Error getting document:", error);
        });
        
    } else {
        $('#btSetInscricao').prop('disabled', true);
    }

    somarKit();
}

/**
 * Soma o valor do kit selecionado a inscrição
 */
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

/**
 * Preapara os dados para a inscrição
 */
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
    //console.log('Teste');
}

/**
 * Atualizar o 
 * @param {*} valor 
 */
function selectURLPagamento (valor) {
    var urlbank = [];

    inter = 'http://www.bancointer.com.br/interpag/002.2.8f460705-e1c5-4da2-bce4-dd85c54cc038.' + valor + '00';
    picpay = 'https://picpay.me/vanlivre/' + valor + '.0';

    nubank[75] = 'https://nubank.com.br/pagar/vq4f/VTekTTwm3y'; //TODO: definir url

    nubank[65] = 'https://nubank.com.br/pagar/vq4f/VTekTTwm3y';

    nubank[55] = 'https://nubank.com.br/pagar/vq4f/vgeHpppfyi';

    nubank[50] = 'https://nubank.com.br/pagar/vq4f/SQj4jAivVK';

    nubank[40] = 'https://nubank.com.br/pagar/vq4f/0FwMQiLBib';

    nubank[30] = 'https://nubank.com.br/pagar/vq4f/OMotL5XMZV';

    $('#inscrefetuada-sec #nubank').attr('href', nubank[valor]);
    //$('#inscrefetuada-sec #inter').attr('href', inter);
    $('#inscrefetuada-sec #picpay').attr('href', picpay);
}

/**
 * Finaliza o processo de inscrição enviando os dados para o firebase
 */
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

function getLote () {
    agora = new Date().getTime();

    if ( agora < inicio1lote) {
        $('header #inscricao').html('Inscrições em breve');
    } else if ( agora < inicio2lote ) {
        $('header #inscricao').removeClass('disabled');
        $('header #inscricao').html('Inscrições (1º lote)');

        $('#inicio-sec #lotemsg').addClass('inscricoes_abertas').html('Estão abertas as inscrições do 1º lote até 31 de dezembro.');

        inscricaoSemDesconto = 75;
        inscricaoCONROD = 30;

        $('.kitconrod').addClass('comkit')

        selKit()

        $('#finscricao fieldset input[name=inscricao]').attr ('value', inscricaoCONROD);
    } else if ( agora < fimDasInscricoes ) {
        $('header #inscricao').removeClass('disabled');
        $('header #inscricao').html('Inscrições (2º lote)');

        $('#inicio-sec #lotemsg').addClass('inscricoes_abertas').html('Estão abertas as inscrições do 2º e último lote, sem os kits, até 14 de janeiro.');

        semKit()

        $('.kitconrod').removeClass('comkit').addClass('semkit')

        inscricaoSemDesconto = 85;
        inscricaoCONROD = 40;
        $('#finscricao fieldset input[name=inscricao]').attr ('value', inscricaoCONROD);
    } else {
        $('header #inscricao').addClass('disabled').html('Inscrições encerradas');

        $('#inicio-sec #lotemsg').addClass('inscricoes_encerradas').html('Inscrições encerradas');
        
    } 
}

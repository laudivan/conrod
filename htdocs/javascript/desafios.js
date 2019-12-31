//TODO: criar funçao para verificar o tempo para controlar o começo ou fim da gincana

var gincana = {
    dtinicio: new Date('2020-01-15').getTime(),
    dtfim: new Date('2020-02-15 19:00').getTime(),
    desafios: [
        { codigo: 0, pergunta: '', resposta: '', pontos: 0, tempo: 0, validade: new Date('2020-01-15').getTime() }
    ]
}

var realizado = null
/*
{
    id: 0,
    nome: '',
    desafios: [
        { coddesafio: 0, desbloqueado: false, respondeu: false, time: null }
    ]
}
*/

function init () {
    //TODO: ler o localStorage para ver se já tem dados
    //TODO: Se tiver, exibir o ID DeMolay, Nome e pontuação
    //TODO: senão, esconder #btnqrcode e exibir botão (modal) para registrar ID DeMolay e o Nome
}

function getScore() {
    //TODO: calcula e retorna os pontos
}
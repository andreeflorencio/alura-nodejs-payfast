const memcached = require('memcached');

const cliente = new memcached('localhost:11211', {
    retries: 10,
    retry: 10000,
    remove: true
});

cliente.set('pagamento-20', {'id':20}, 60000, function(err){
    console.log('Nova chave adicionada ao cache: pagamento-20');
    
})

cliente.get('pagamento-20', function (err, retorno) {
    if (err || !retorno) {
        console.log('MISS - chave não encontrada');
    } else {
        console.log('HIT - valor: ' + JSON.stringify(retorno));
    }
    
})
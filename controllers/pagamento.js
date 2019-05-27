const PAGAMENTO_CRIADO = "CRIADO";
const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
const PAGAMENTO_CANCELADO = "CANCELADO";

const logger = require('../servicos/logger.js')

module.exports= (app)=>{

    app.get('/pagamentos', (req, res)=>{
        res.send('OK');
    });

    app.get('/pagamentos/pagamento/:id', (req, res)=>{
        let id = req.params.id;
        console.log(`Consultando pagamento: ${id}`);

        logger.info(`Consultando pagamento: ${id}`);

        let memcachedClient = app.servicos.memcachedClient();

        memcachedClient.get('pagamento-' + id, function (err, retorno) {
            if (err || !retorno) {
                console.log('MISS - chave não encontrada');

                let connection = app.persistencia.connectionFactory();
                let pagamentoDao = new app.persistencia.PagamentoDao(connection);

                pagamentoDao.buscaPorId(id, (err, resultado)=>{
                    if(err){
                        console.log('Erro ao consultar no banco: ' + err);
                        res.status(500).send(err);
                        return;
                    }

                    console.log('Pagamento encontrado: ' + JSON.stringify(resultado));
                    res.status(200).json(resultado);
                    return;

                })


            } else {
                console.log('HIT - valor: ' + JSON.stringify(retorno));
                res.status(200).json(retorno);
                return;

            }
            
        });     
        
    });

    app.delete('/pagamentos/pagamento/:id', (req, res)=>{
        
        let pagamento = {};
        let id = req.para.id;

        pagamento.id =id;
        pagamento.status = PAGAMENTO_CANCELADO;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, (erro, resultado)=>{
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento cancelado');
            res.status(204).send(pagamento);
        })

    })

    app.put('/pagamentos/pagamento/:id', (req, res)=>{

        let pagamento = {};
        let id = req.params.id;

        pagamento.id =id;
        pagamento.status = PAGAMENTO_CONFIRMADO;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento, (erro, resultado)=>{
            if (erro) {
                res.status(500).send(erro);
                return;
            }
            console.log('pagamento criado');
            res.send(pagamento);
        })

    });

    app.post('/pagamentos/pagamento', (req, res)=>{
        
        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento é obrigatório").notEmpty();
        req.assert("pagamento.valor", "Valor obrigatório e deve ser um decimal").notEmpty().isFloat();

        let erros = req.validationErrors();

        if (erros){
            console.log("Erros de validação encontrados");
            res.status(400).send(erros);
            return;
        }
        
        let pagamento = req.body["pagamento"];
        console.log('Processando uma requisição de um novo pagamento');

        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.data = new Date;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);
        
        pagamentoDao.salva(pagamento, (erro, resultado)=>{
            
            if (erro) {

                res.status(500).send(erro);
                
            }else{
                pagamento.id = resultado.insertId;
                console.log('Pagamento criado');

                let memcachedClient = app.servicos.memcachedClient();

                memcachedClient.set('pagamento-'+pagamento.id, pagamento, 60000, function(err){
                    console.log('Nova chave adicionada ao cache: pagamento-'+pagamento.id);
                    
                })

                if(pagamento.forma_de_pagamento == 'cartao'){
                    let cartao = req.body['cartao'];
                    console.log(cartao);

                    let clienteCartoes = new app.servicos.clienteCartoes();

                    clienteCartoes.autoriza(cartao, (err, request, response, retorno)=>{
                        
                        if (err) {
                            console.log(err);
                            
                            res.status(400).json(err);
                            return;
                            
                        }

                        console.log(retorno);
                        res.status(201).json(retorno);
                        return;
                    });


                } else {

                    res.location('/pagamentos/pagamento/' + pagamento.id);
                
                    let response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href:'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                                rel: 'confirmar',
                                method: 'PUT'
                            },
                            {
                                href:'http://localhost:3000/pagamentos/pagamento/' + pagamento.id,
                                rel: 'cancelar',
                                method: 'DELETE'
                            }
                        ]
                    }
                    
                    res.status(201).json(response)
                }

            }            
            
        });
    });
}
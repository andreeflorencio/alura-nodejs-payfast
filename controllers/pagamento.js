module.exports= (app)=>{
    app.get('/pagamentos', (req, res)=>{
        res.send('OK');
    });

    app.delete('/pagamentos/pagamento/:id', (req, res)=>{
        
        let pagamento = {};
        let id = req.params.id;

        pagamento.id =id;
        pagamento.status = 'CANCELADO'

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
        pagamento.status = 'CONFIRMADO'

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
        
        req.assert("forma_de_pagamento", "Forma de pagamento é obrigatório").notEmpty();
        req.assert("valor", "Valor obrigatório e deve ser um decimal").notEmpty().isFloat();

        let erros = req.validationErrors();

        if (erros){
            console.log("Erros de validação encontrados");
            res.status(400).send(erros);
            return;
        }
        
        let pagamento = req.body;
        console.log('Processando uma requisição de um novo pagamento');

        pagamento.status = 'CRIADO';
        pagamento.data = new Date;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);
        
        pagamentoDao.salva(pagamento, (erro, resultado)=>{
            
            if (erro) {

                res.status(500).send(erro);
                
            }else{
                console.log('Pagamento criado');
                res.location('/pagamentos/pagamento/' + resultado.insertId);
                pagamento.id = resultado.insertId;
                res.status(201).json(pagamento)
            }            
            
        });
    })
}
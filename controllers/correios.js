module.exports = (app)=>{

    app.post('/correios/calculo-prazo', function(req,res){
        let dadosDaEntrega = req.body;

        let correiosSOAPClient = new app.servicos.correiosSOAPClient();

        correiosSOAPClient.calulaPrazo(dadosDaEntrega, function(erro, resultado){
            if (erro) {
                res.status(500).send(erro);
                return;
            }

            console.log('Prazo calculado');
            res.status(200).json(resultado);
            
        });

    })

}
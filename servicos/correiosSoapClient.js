const soap = require('soap');

soap.createClient('http://ws.correios.com.br/calculador/calcprecoprazo.asmx?WSDL', (err, cliente)=>{
 console.log('Cliente SOAP criado');
 
    cliente.CalcPrazo(
        {
            'nCdServico':'40010',
            'sCepOrigem':'04101300',
            'sCepDestino':'65000600'
        }, 
        (erro, resultado)=>{
            console.log(JSON.stringify(resultado));
        
        }
    )

})
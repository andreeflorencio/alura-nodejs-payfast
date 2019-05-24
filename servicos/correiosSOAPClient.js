const soap = require('soap');

function CorreiosSOAPClient(params) {
    this._url = 'http://ws.correios.com.br/calculador/calcprecoprazo.asmx?WSDL';
}

module.exports = ()=>{
    return CorreiosSOAPClient;
}

CorreiosSOAPClient.prototype.calulaPrazo = function (args, callback){

    soap.createClient(this._url, (err, cliente)=>{
        console.log('Cliente SOAP criado');
        cliente.CalcPrazo(args, callback);       
    });
}


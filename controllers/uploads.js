const fs = require('fs');
module.exports = function(app){

    /*
    Comando para testar rota
    curl -X POST http://localhost:3000/upload/imagem --data-binary @imagem.jpg -H "Content-type: application/octet-stream" -v -H "filename: imagem-x.jpg"
    */

    app.post('/upload/imagem', (req, res)=>{
        console.log('Recebendo imagem');

        let fileName = req.headers.filename;

        req.pipe(fs.createWriteStream('files/' + fileName))
           .on('finish', ()=>{
               console.log('arquivo escrito');
               
               res.status(201).send('OK')
           })
        
    });
}
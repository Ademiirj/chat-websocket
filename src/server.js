const express = require('express'); //que vai fazer a trativa para mostrar arquivo estático
const path = require('path'); //padrão node


const app = express(); 
const server = require('http').createServer(app); //definindo o protocolo http
const io = require('socket.io')(server) //definindo o protocolo wss para o websocket
const cors = require("cors");

//configurando para que nossa aplicação entenda que vamos utilizar html no front
app.use(express.static(path.join(__dirname, 'public')));//definindo onde irão ficar nossos arquivos publicos da aplicação
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res)=>{
    res.render('index.html');
});

app.listen(3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port);
})


//array de messages vai servir para guardar nossas mensagens
let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);
    
    socket.on('sendMessage', data =>{
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data); 
    });
});

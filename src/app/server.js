const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
    console.log('Novo cliente conectado!');

    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);
        
        ws.send(`Você disse: ${message}`);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket está rodando na porta 8080');

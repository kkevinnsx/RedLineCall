import { useEffect } from 'react';

export default function WebSocketComponent() {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('Conectado ao servidor WebSocket');
            socket.send('Olá, servidor!');
        };

        socket.onmessage = (event) => {
            console.log(`Mensagem do servidor: ${event.data}`);
        };

        socket.onclose = () => {
            console.log('Desconectado do servidor WebSocket');
        };

        return () => {
            socket.close();
        };
    }, []);

    return <div>Componente WebSocket Ativo</div>;
}

import { NextResponse } from 'next/server'; // Importando NextResponse para construir a resposta da API
import { pusher } from '../../../modules/auth/services/pusher'; // Ajuste o caminho conforme necessário

export async function POST(request) {
    try {
        const { route } = await request.json(); // Extraindo a rota do corpo da requisição
        console.log('Tentando atualizar a rota:', route); // Log para depuração

        // Verificando se a rota está definida
        if (!route) {
            throw new Error('A rota não foi fornecida.');
        }

        // Acionando o Pusher para atualizar a rota
        await pusher.trigger('vehicle-location', 'update-route', { newRoute: route });
        console.log('Rota atualizada com sucesso!'); // Log para depuração

        return NextResponse.json({ message: 'Rota atualizada com sucesso!' }); // Retornando resposta de sucesso
    } catch (error) {
        console.error('Erro ao atualizar a rota:', error); // Log do erro
        return NextResponse.json({ error: 'Erro ao atualizar a rota', details: error.message }, { status: 500 }); // Retornando erro
    }
}

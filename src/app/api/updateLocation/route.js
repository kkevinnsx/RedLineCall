import prisma from '../../lib/prisma';
import { getUserProfile } from '../../../modules/auth/services/userService';

export async function POST(req) {
    try {
        const { latitude, longitude } = await req.json();

        if (!latitude || !longitude) {
            console.error("Latitude ou longitude ausentes ou inválidas:", { latitude, longitude });
            return new Response(
                JSON.stringify({ error: 'Latitude e longitude são obrigatórios.' }),
                { status: 400 }
            );
        }

        const userId = await getUserIdFromToken(req); // Função para obter ID do usuário pelo token

        if (!userId) {
            return new Response(
                JSON.stringify({ error: 'Usuário não autenticado.' }),
                { status: 401 }
            );
        }

        // Atualização no banco de dados
        await prisma.user.update({
            where: { id: userId },
            data: {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            },
        });

        console.log('Localização atualizada com sucesso para o usuário:', userId);
        return new Response(
            JSON.stringify({ message: 'Localização atualizada com sucesso.' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao atualizar localização:', error);
        return new Response(
            JSON.stringify({ error: 'Erro interno do servidor.' }),
            { status: 500 }
        );
    }
}
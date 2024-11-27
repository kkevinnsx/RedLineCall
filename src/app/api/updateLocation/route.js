import prisma from '../../lib/prisma';
import { getUserProfile } from '../../../modules/auth/services/userService';

export async function POST(req) {
    try {
        console.log('Iniciando atualização de localização');
        
        const userProfile = await getUserProfile(req);
        
        if (!userProfile) {
            console.log('Usuário não autenticado');
            return new Response(
                JSON.stringify({ error: 'Usuário não autenticado.' }),
                { status: 401 }
            );
        }

        const { latitude, longitude } = await req.json();

        if (!latitude || !longitude) {
            console.log('Latitude ou longitude ausente');
            return new Response(
                JSON.stringify({ error: 'Latitude e longitude são obrigatórios.' }),
                { status: 400 }
            );
        }

        console.log('Atualizando localização no banco de dados...');
        
        await prisma.user.update({
            where: { id: userProfile.id },
            data: { latitude, longitude },
        });

        console.log('Localização atualizada com sucesso para o usuário:', userProfile.id);

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

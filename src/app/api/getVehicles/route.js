import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';
import { getUserProfile } from '../../../modules/auth/services/userService';

export async function GET(request){
    console.log('API chamada: /api/getVehicles');
    try{
        const userProfile = await getUserProfile(request);

        if(!userProfile) {
            return NextResponse.json({error: 'Usuario não encontrado'}, {status: 401});
        }

        const availableVehicle = await prisma.viatura.findMany({
            where: {
                status: true,
                statusChat: false,
                responsavel: {
                    idPerfil: 'B',
                },
            },
        });

        return NextResponse.json(availableVehicle);
    } catch (error) {
        console.error('Erro ao buscar viaturas disponíveis', error);
        return NextResponse.json({ error: 'Erro ao buscar viaturas disponiveis', details: error.message}, {status: 500})
    }
}
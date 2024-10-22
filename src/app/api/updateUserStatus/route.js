import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getUserProfile } from "../../../modules/auth/services/userService";

export async function POST(request) {
    try{ 
        const userProfile = await getUserProfile(request);

        if (!userProfile){
            return NextResponse.json({ error: 'Usuario não encontrado'}, { status: 401});
        }

        const { statusChat, statusOcor } = await request.json();

        await prisma.user.update({
            where: {id: userProfile.id},
            data: {statusChat, statusOcor},
        });

        return NextResponse.json({statusChat, statusOcor});
    } catch (error) {
        console.error('Erro ao atualizar o status do usuario', error);
        return NextResponse.json({error: 'Erro ao atualizar o status do usuário', details: error.message}, {status: 500});
    }
}
import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { getUserProfile } from '../../../modules/auth/services/userService';

export async function GET(request) {
    console.log("API chamada: /api/startVigilance");
    try{
        const userProfile = await getUserProfile(request);

        if(!userProfile) {
            return NextResponse.json({error: "Usuario não encontrado"}, {status: 401});
        }

        const viaturas = await prisma.viatura.findMany({
            where: {
                responsavelId: userProfile.id, 
            },
        });

        return NextResponse.json(viaturas);
    } catch (error) {
        console.error("Erro ao buscar viaturas", error);
        return NextResponse.json({ error: "Erro ao buscar viaturas", details: error.message}, { status: 500});
    }
}

export async function POST(request) {
    try {
        const userProfile = await getUserProfile(request);

        if (!userProfile) {
            return NextResponse.json({ error: 'Usuário não encontrado!' }, { status: 401 });
        }

        const usuario = await prisma.user.findFirst({
            where: {
                id: userProfile.id,
            },
        });

        if (!usuario) {
            console.log("Nenhum usuario foi cadastrada para esse usuario");
            return NextResponse.json({ error: "Nenhum usuario foi cadastrada para esse usuario" });
        }

        const updateStatus = !usuario.statusChat; 

        await prisma.user.update({
            where: { id: userProfile.id },
            data: { statusChat: updateStatus },
        });

        return NextResponse.json({ statusChat: updateStatus });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar o status do usuário", details: error.message }, { status: 500 });
    }
}
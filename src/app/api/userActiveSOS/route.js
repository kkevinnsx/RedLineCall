import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";
import { getUserProfile } from '../../../modules/auth/services/userService';

export async function GET(request) {
    console.log("API chamada: /api/userActiveSOS");
    try {
        const userProfile = await getUserProfile(request);

        if (!userProfile) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            where: {
                id: userProfile.id,
            },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuário', error);
        return NextResponse.json({ error: "Erro ao buscar usuários", details: error.message }, { status: 500 });
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
            console.log("Nenhum usuário cadastrado para esse usuário");
            return NextResponse.json({ error: "Nenhum usuário cadastrado para esse usuário" });
        }

        const updateStatus = !usuario.statusChat;

        await prisma.user.update({
            where: { id: userProfile.id },
            data: { statusChat: updateStatus },
        });

        return NextResponse.json({ statusChat: updateStatus });
    } catch (error) {
        console.error('Erro ao atualizar o status do usuário', error);
        return NextResponse.json({ error: "Erro ao atualizar o status do usuário", details: error.message }, { status: 500 });
    }
}

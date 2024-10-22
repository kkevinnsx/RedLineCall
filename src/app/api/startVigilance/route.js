import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { getUserProfile } from '../../../modules/auth/services/userService';

// Função para buscar viaturas associadas ao usuário logado
export async function GET(request) {
    console.log("API chamada: /api/startVigilance");
    try {
        const userProfile = await getUserProfile(request);

        if (!userProfile) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
        }

        const viaturas = await prisma.viatura.findMany({
            where: {
                responsavelId: userProfile.id,
            },
        });

        return NextResponse.json(viaturas);
    } catch (error) {
        console.error("Erro ao buscar viaturas", error);
        return NextResponse.json({ error: "Erro ao buscar viaturas", details: error.message }, { status: 500 });
    }
}

// Função para alterar o status de uma viatura associada ao usuário logado
export async function POST(request) {
    try {
        const userProfile = await getUserProfile(request);

        if (!userProfile) {
            return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
        }

        const body = await request.json();
        const { id, latitude, longitude } = body;

        if (!id) {
            return NextResponse.json({ error: "ID da viatura ausente" }, { status: 400 });
        }

        // Verifica se o usuário logado é o responsável pela viatura
        const viatura = await prisma.viatura.findFirst({
            where: {
                responsavelId: userProfile.id, // Confirma que o usuário logado é o responsável
                id,  // Verifica se a viatura existe
            },
        });

        if (!viatura) {
            console.log("Nenhuma viatura foi cadastrada para esse usuário");
            return NextResponse.json({ error: "Nenhuma viatura foi cadastrada para esse usuário" }, { status: 404 });
        }

        // Atualiza o status da viatura (inverte o status atual)
        const updateStatus = !viatura.status;

        const viaturaAtualizada = await prisma.viatura.update({
            where: { id: viatura.id },
            data: {
                status: updateStatus,
                latitude: latitude ?? viatura.latitude,  // Atualiza latitude se fornecida
                longitude: longitude ?? viatura.longitude, // Atualiza longitude se fornecida
            },
        });

        return NextResponse.json({ status: updateStatus, message: "Status da viatura atualizado com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar a viatura", error);
        return NextResponse.json({ error: "Erro ao atualizar a viatura", details: error.message }, { status: 500 });
    }
}

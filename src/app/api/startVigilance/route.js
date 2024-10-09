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

        if (!userProfile){
            return NextResponse.json({error: "Usuario não encontrado"}, {status: 401});
        }

        const viatura = await prisma.viatura.findFirst({
            where: {
                responsavelId: userProfile.id,
            },
        });

        if (!viatura) {
            console.log("Nenhuma viatura foi cadastrada para esse usuario");
            return NextResponse.json({ error: "Nenhuma viatura foi cadastrada para esse usuario"});
        }

        const updateStatus = !viatura.status;

        await prisma.viatura.update({
            where: { id: viatura.id },
            data: { status: updateStatus },
        });

        return NextResponse.json({ status: updateStatus });
    } catch (error) {
        return NextResponse.json({ error: "Erro ao atualizar a viatura", details: error.message}, {status: 500});
    }
}

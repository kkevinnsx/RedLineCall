import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
    console.log("API chamada: /api/policeList");
    try {
        const users = await prisma.user.findMany({
            where: {
                idPerfil: 'B',
                viaturas: {
                    none: {} 
                },
            },
        });
        console.log("Usuários encontrados:", users);
        return NextResponse.json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return NextResponse.json({ error: "Erro ao buscar usuários", details: error.message }, { status: 500 });
    }
}

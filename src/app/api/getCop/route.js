import prisma from "../../lib/prisma";
import { getUserProfile } from "../../../modules/auth/services/userService";
import { destroySession } from "../../../modules/auth/services/authService";
import * as bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const policeProfile = await getUserProfile(req);
        const policeId = parseInt(policeProfile.id, 10)

        const police = await prisma.user.findUnique({
            where: { id: policeId },
            select: { fullName: true }
        });

        if(!police) {
            return new response(JSON.stringify({ error: 'Nome de usuário não encontrado'}), {status: 404});
        }

        const ocorrencias = await prisma.ocorrencia.findMany({
            where: { idUsuario: policeId },
            select: {
                data: true,
                motivo: true,
                localizacao: {
                    select: {
                        latitude: true,
                        longitude: true,
                    }
                }
            },
            orderBy: { data: 'desc'}
        });
        return new Response(JSON.stringify({ fullName: user.fullName, ocorrencias,}), { status: 200});
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return new Response(
            JSON.stringify({error: 'Erro interno do servidor', details: error.message}),
            {status: 500}
        );
    } 
}

export async function POST(req) {
    try {
        const policeProfile = await getUserProfile(req);
        const policeId = parseInt(policeProfile.id, 10);

        const { currentEmail, newEmail, cep, number, cpf, newPassword, confirmPassword} = await req.json();

    } catch (error) {
        
    }
}
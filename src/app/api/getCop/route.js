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

        const { currentEmail, newEmail, cpf, newPassword, confirmPassword} = await req.json();

        if (currentEmail && newEmail) {
            const police = await prisma.user.findUnique({
                where: { id: policeId },
                select: { email: true },
            });

            if(!police){
                return new Response(JSON.stringify({ error: 'Usuário não encontrado '}), {status: 404});
            }

            if(user.email !== currentEmail) {
                return new Response(JSON.stringify({ error: 'O e-mail atual está incorreto'}), {status: 400})
            }

            await prisma.user.update({
                where: { id: policeId},
                data:  { email: newEmail},
            });

            return new Response(JSON.stringify({ sucess: true}), {status:200});
        }

        if(cpf && newPassword && confirmPassword) {
            const police = await prisma.user.findUnique({
                where: { id: policeId},
                select: { cpf: true},
            });

            if(!police || police.cpf !== cpf ){
                return new Response(JSON.stringify({error: 'CPF incorreto'}), {status: 400});
            }

            if(newPassword !== confirmPassword) {
                return new Response(JSON.stringify({error: 'As senhas não correspondem'}), {status: 400});
            }

            const hashPassword = await bcrypt.hash(newPassword, 10);
            await prisma.user.update({
                where: { id: policeId},
                data: {password: hashPassword},
            });

            return new Response(JSON.stringify({success: true, message: 'senha alterada com sucesso!'}),{status: 200})
        }

    } catch (error) {
        
    }
}
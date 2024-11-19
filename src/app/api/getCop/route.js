import prisma from "../../lib/prisma";
import { getUserProfile } from "../../../modules/auth/services/userService";
import { destroySession } from "../../../modules/auth/services/authService";
import * as bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const policeProfile = await getUserProfile(req);
        const policeId = parseInt(policeProfile.id, 10);

        const user = await prisma.user.findUnique({
            where: { id: policeId },
            select: { fullName: true, idPerfil: true }  
        });

        if (!user) {
            return new Response(JSON.stringify({ error: 'Usuário não encontrado' }), { status: 404 });
        }

        let ocorrencias;
        
        if (user.idPerfil === 'B') {
            const viatura = await prisma.viatura.findFirst({
                where: { responsavelId: policeId },
                select: { id: true }
            });

            if (viatura) {
                ocorrencias = await prisma.ocorrencia.findMany({
                    where: { idViatura: viatura.id },
                    select: {
                        data: true,
                        motivo: true,
                        localizacao: {
                            select: {
                                latitude: true,
                                longitude: true,
                            },
                        },
                        user: { 
                            select: {
                                fullName: true,  
                                cpf: true,      
                            }
                        }
                    },
                    orderBy: { data: 'desc' },
                });
            } else {
                ocorrencias = []; 
            }
        } else {
            ocorrencias = await prisma.ocorrencia.findMany({
                where: { idUsuario: policeId },
                select: {
                    data: true,
                    motivo: true,
                    localizacao: {
                        select: {
                            latitude: true,
                            longitude: true,
                        },
                    },
                    user: {  
                        select: {
                            fullName: true,  
                            cpf: true,      
                        }
                    }
                },
                orderBy: { data: 'desc' },
            });
        }

        return new Response(JSON.stringify({ fullName: user.fullName, ocorrencias }), { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return new Response(
            JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const policeProfile = await getUserProfile(req);
        const policeId = parseInt(policeProfile.id, 10);

        const { cpf, newPassword, confirmPassword } = await req.json();

        if (!cpf || !newPassword || !confirmPassword) {
            return new Response(
                JSON.stringify({ error: 'Todos os campos (CPF, Nova senha, Confirmação de senha) são obrigatórios' }),
                { status: 400 }
            );
        }

        if (newPassword !== confirmPassword) {
            return new Response(
                JSON.stringify({ error: 'As senhas não correspondem' }),
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: policeId },
            select: { cpf: true },
        });

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Usuário não encontrado' }),
                { status: 404 }
            );
        }

        if (user.cpf !== cpf) {
            return new Response(
                JSON.stringify({ error: 'O CPF informado está incorreto' }),
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: policeId },
            data: { password: hashedPassword },
        });

        return new Response(
            JSON.stringify({ success: true, message: 'Senha alterada com sucesso!' }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Erro ao alterar a senha:', error);
        return new Response(
            JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
            { status: 500 }
        );
    }
}
import prisma from "../../lib/prisma";
import { getUserProfile } from "../../../modules/auth/services/userService";

export async function GET(req) {
    try {
        const user = await getUserProfile(req);

        if (!user) {
            return new Response(
                JSON.stringify({ message: "Usuário não autenticado" }),
                { status: 401 }
            );
        }

        const viatura = await prisma.viatura.findFirst({
            where: {
                responsavelId: user.id,
            },
        });

        if (!viatura) {
            return new Response(
                JSON.stringify({ message: "Nenhuma viatura encontrada" }),
                { status: 404 }
            );
        }

        const ocorrencia = await prisma.ocorrencia.findFirst({
            where: {
                idViatura: viatura.id,
                status: true, 
            },
        });

        if (!ocorrencia) {
            return new Response(
                JSON.stringify({ message: "Nenhuma ocorrência ativa encontrada" }),
                { status: 404 }
            );
        }

        let chat = await prisma.chat.findFirst({
            where: {
                idViatura: ocorrencia.idViatura,
                statusLiberado: true,
            },
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    idUsuario: user.id,
                    idViatura: ocorrencia.idViatura,
                    statusLiberado: true,
                    conteudo: "Chat inicializado",
                    data: new Date(),
                },
            });
        }

        const userName = user.fullName;

        return new Response(
            JSON.stringify({
                message: "Ocorrência ativa encontrada",
                idChat: chat.id,
                userName: userName, 
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao buscar ocorrências para viaturas:", error);
        return new Response(
            JSON.stringify({ message: "Erro interno no servidor", error: error.message }),
            { status: 500 }
        );
    }
}

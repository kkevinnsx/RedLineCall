import prisma from "../../lib/prisma"; // Ajuste o caminho
import { getUserProfile } from "../../../modules/auth/services/userService"; // Ajuste o caminho

export async function GET(req) {
    try {
        const user = await getUserProfile(req);

        if (!user) {
            return new Response(
                JSON.stringify({ message: "Usuário não autenticado" }),
                { status: 401 }
            );
        }

        const ocorrencia = await prisma.ocorrencia.findFirst({
            where: {
                idUsuario: user.id, 
                status: true,       
            },
            include: {
                viatura: {
                    select: { numeroViatura: true },
                },
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
                idUsuario: ocorrencia.idUsuario,
                idViatura: ocorrencia.idViatura,
                statusLiberado: true,
            },
        });

        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    idUsuario: ocorrencia.idUsuario,
                    idViatura: ocorrencia.idViatura, 
                    statusLiberado: true,
                    conteudo: "Chat inicializado",
                    data: new Date(), 
                },
            });
        }

        return new Response(
            JSON.stringify({
                message: "Ocorrência ativa encontrada",
                numeroViatura: ocorrencia.viatura?.numeroViatura || null,
                idChat: chat.id, 
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao buscar ocorrência ou gerenciar chat:", error);
        return new Response(
            JSON.stringify({
                message: "Erro interno no servidor",
                error: error.message,
            }),
            { status: 500 }
        );
    }
}

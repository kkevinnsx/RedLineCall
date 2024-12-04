import prisma from "../../lib/prisma"; // Ajuste o caminho
import { getUserProfile } from "../../../modules/auth/services/userService"; // Ajuste o caminho

export async function GET(req) {
    try {
        // Obtém o perfil do usuário a partir do request
        const user = await getUserProfile(req);

        // Verifica se o usuário está autenticado
        if (!user) {
            return new Response(
                JSON.stringify({ message: "Usuário não autenticado" }),
                { status: 401 }
            );
        }

        // Busca a ocorrência ativa do usuário no banco de dados
        const ocorrencia = await prisma.ocorrencia.findFirst({
            where: {
                idUsuario: user.id, // Id do usuário autenticado
                status: true,       // Somente ocorrências ativas
            },
            include: {
                viatura: {
                    select: { numeroViatura: true }, // Inclui apenas o número da viatura
                },
            },
        });

        if (!ocorrencia) {
            return new Response(
                JSON.stringify({ message: "Nenhuma ocorrência ativa encontrada" }),
                { status: 404 }
            );
        }

        // Verifica se já existe um chat ativo vinculado à ocorrência
        let chat = await prisma.chat.findFirst({
            where: {
                idUsuario: ocorrencia.idUsuario,
                idViatura: ocorrencia.idViatura,
                statusLiberado: true,
            },
        });

        // Se o chat não existir, cria um novo
        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    idUsuario: ocorrencia.idUsuario, // Usando o idUsuario da ocorrência
                    idViatura: ocorrencia.idViatura, // Usando o idViatura da ocorrência
                    statusLiberado: true,
                    conteudo: "Chat inicializado",
                    data: new Date(), // Insere a data e hora atuais
                },
            });
        }

        // Retorna os dados da ocorrência ativa e do chat encontrado/criado
        return new Response(
            JSON.stringify({
                message: "Ocorrência ativa encontrada",
                numeroViatura: ocorrencia.viatura?.numeroViatura || null,
                idChat: chat.id, // Envia o ID do chat
            }),
            { status: 200 }
        );
    } catch (error) {
        // Trata erros internos e retorna a mensagem de erro
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

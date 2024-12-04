import prisma from "../../lib/prisma"; // Ajuste o caminho
import { getUserProfile } from "../../../modules/auth/services/userService"; // Ajuste o caminho
import { triggerEvent } from "../../lib/pusher"; // Ajuste o caminho

export async function POST(req) {
    try {
        const body = await req.json();
        console.log("Dados recebidos na API:", body);

        const { texto, idChat } = body;

        if (!texto || !idChat) {
            return new Response(
                JSON.stringify({ message: "Campos obrigatórios estão faltando." }),
                { status: 400 }
            );
        }

        const user = await getUserProfile(req);
        if (!user) {
            return new Response(
                JSON.stringify({ message: "Usuário não autenticado" }),
                { status: 401 }
            );
        }

        // Insere a mensagem no banco de dados
        const novaMensagem = await prisma.mensagem.create({
            data: {
                texto,
                audio: "", // Adiciona um valor padrão para evitar erro
                ligacao: "",
                idChat,
            },
        });

        console.log("Mensagem criada com sucesso:", novaMensagem);

        triggerEvent(`chat-${idChat}`, "nova-mensagem", novaMensagem);

        return new Response(JSON.stringify({ message: "Mensagem enviada com sucesso", novaMensagem }), {
            status: 200,
        });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return new Response(
            JSON.stringify({ message: "Erro interno no servidor", error: error.message }),
            { status: 500 }
        );
    }
}

import prisma from "../../lib/prisma"; 
import { getUserProfile } from "../../../modules/auth/services/userService"; 
import { triggerEvent } from "../../lib/pusher"; 

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

        let idViatura = null;
        if (user.idPerfil === 'B') {
            const viatura = await prisma.viatura.findFirst({
                where: { responsavelId: user.id },
            });
            if (viatura) {
                idViatura = viatura.id;
            }
        }

        const novaMensagem = await prisma.mensagem.create({
            data: {
                texto,
                audio: "", 
                ligacao: "", 
                idChat,
                idUsuario: user.id, 
                idViatura, 
            },
            include: {
                user: true,
            },
        });

        console.log("Mensagem criada com sucesso:", novaMensagem);

        triggerEvent(`chat-${idChat}`, "nova-mensagem", novaMensagem);

        return new Response(JSON.stringify({
            message: "Mensagem enviada com sucesso",
            novaMensagem,
        }), { status: 200 });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return new Response(
            JSON.stringify({ message: "Erro interno no servidor", error: error.message }),
            { status: 500 }
        );
    }
}

import prisma from "../../lib/prisma";
import { getUserProfile } from "../../../modules/auth/services/userService";

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const idChat = url.searchParams.get("idChat");

        if (!idChat || isNaN(Number(idChat))) {
            console.error("idChat inválido ou não fornecido:", idChat);
            return new Response(
                JSON.stringify({ message: "idChat inválido ou não fornecido." }),
                { status: 400 }
            );
        }

        const mensagens = await prisma.mensagem.findMany({
            where: { idChat: Number(idChat) },
            orderBy: { createdAt: "asc" },
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
            },
        });

        return new Response(JSON.stringify(mensagens), { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        return new Response(
            JSON.stringify({ message: "Erro interno no servidor", error: error.message }),
            { status: 500 }
        );
    }
}

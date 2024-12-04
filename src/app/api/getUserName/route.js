import prisma from "../../lib/prisma";

export async function GET(req) {
    if (req.method !== 'GET') {
        return new Response(
            JSON.stringify({ message: "Método não permitido" }),
            { status: 405 } 
        );
    }

    const { searchParams } = new URL(req.url);
    const idChat = searchParams.get("idChat");

    if (!idChat) {
        return new Response(
            JSON.stringify({ message: "idChat não fornecido" }),
            { status: 400 }
        );
    }

    try {
        const chat = await prisma.chat.findUnique({
            where: {
                id: parseInt(idChat), 
            },
            include: {
                user: true, 
            },
        });

        if (!chat) {
            return new Response(
                JSON.stringify({ message: "Chat não encontrado" }),
                { status: 404 } 
            );
        }

        if (!chat.user) {
            return new Response(
                JSON.stringify({ message: "Usuário não associado ao chat" }),
                { status: 404 } 
            );
        }

        return new Response(
            JSON.stringify({ fullName: chat.user.fullName }), 
            { status: 200 }
        );
    } catch (error) {
        console.error("Erro ao buscar nome do usuário:", error);
        return new Response(
            JSON.stringify({ message: "Erro ao buscar nome do usuário", error: error.message }),
            { status: 500 } 
        );
    }
}

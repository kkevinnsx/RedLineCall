import prisma from "../../lib/prisma";

export async function POST(req) {
    try {
        const { cpf } = await req.json();

        if (cpf) {
            const users = await prisma.user.findMany({
                where: {
                    cpf: { equals: cpf },
                    idPerfil: 'C',
                },
                select: {
                    cpf: true,
                    fullName: true,
                    email: true,
                    ocorrencias: {
                        orderBy: { data: 'desc' },
                        take: 3,
                        select: {
                            motivo: true,
                        },
                    },
                },
            });

            if (users.length === 0) {
                return new Response(JSON.stringify({ error: "Não existe usuário com esse CPF" }), { status: 404 });
            }

            return new Response(JSON.stringify({ users }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: "CPF não fornecido" }), { status: 400 });
        
    } catch (error) {
        console.error("Erro ao buscar usuários: ", error);
        return new Response(JSON.stringify({ error: "Erro interno ao servidor" }), { status: 500 });
    }
}

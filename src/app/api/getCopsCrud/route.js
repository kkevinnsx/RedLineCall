import prisma from "../../lib/prisma";

export async function POST(req) {
    try {
        const { numeroViatura } = await req.json();

        const viatura = await prisma.viatura.findFirst({
            where: { numeroViatura: parseInt(numeroViatura) },
            include: {
                responsavel: true,
                ocorrencias: true,
            },
        });

        if (!viatura) {
            return new Response(JSON.stringify({ message: "Viatura não encontrada" }), { status: 404 });
        }
        return new Response(JSON.stringify({ viatura }), { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar viatura:", error);
        return new Response(JSON.stringify({ message: "Erro ao buscar viatura" }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { numeroViatura, modeloViatura, placaViatura, responsavelNome, responsavelCpf, responsavelEmail, ocorrencias } = await req.json();

        const viatura = await prisma.viatura.findFirst({
            where: { numeroViatura: parseInt(numeroViatura) },
            include: {
                ocorrencias: {
                    take: 3, 
                    orderBy: {
                        data: 'desc', 
                    },
                },
            },
        });

        if (!viatura) {
            return new Response(JSON.stringify({ message: "Viatura não encontrada" }), { status: 404 });
        }

        const viaturaAtualizada = await prisma.viatura.update({
            where: { id: viatura.id },
            data: {
                modeloViatura,
                placaViatura,
                numeroViatura,
                responsavel: {
                    update: {
                        fullName: responsavelNome,
                        cpf: responsavelCpf,
                        email: responsavelEmail,
                    },
                },
                ocorrencias: {
                    updateMany: ocorrencias.map(ocorrencia => ({
                        where: { id: ocorrencia.id },  
                        data: { motivo: ocorrencia.motivo }, 
                    })),
                },
            },
            include: { responsavel: true, ocorrencias: true }, 
        });

        return new Response(JSON.stringify({ viatura: viaturaAtualizada }), { status: 200 });
    } catch (error) {
        console.error("Erro ao atualizar viatura:", error);
        return new Response(JSON.stringify({ message: "Erro ao atualizar a viatura" }), { status: 500 });
    }
}

export function OPTIONS() {
    return new Response(null, {
        status: 405,
        headers: {
            Allow: "POST, PUT",
        },
    });
}

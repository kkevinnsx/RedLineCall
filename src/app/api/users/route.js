import prisma from '../../lib/prisma';

export async function fetchUserById(userId) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }
        return user;
    } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        throw error;
    }
}

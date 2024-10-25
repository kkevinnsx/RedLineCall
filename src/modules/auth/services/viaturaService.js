import prisma from '../lib/prisma'; // Supondo que você já tenha o Prisma configurado

/**
 * Busca a viatura associada ao usuário logado
 * @param {number} userId - ID do usuário logado
 * @returns {Object|null} - Retorna a viatura do usuário logado, ou null se não houver
 */
export async function getViaturaByUserId(userId) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { viaturas: true } // Inclui a relação com a viatura associada ao usuário
        });

        if (!user || !user.viaturas || user.viaturas.length === 0) {
            return null;
        }

        // Supondo que cada usuário tenha apenas uma viatura pareada
        return user.viaturas[0]; // Retorna a primeira viatura encontrada (única)
    } catch (error) {
        console.error("Erro ao buscar a viatura do usuário:", error);
        throw new Error("Erro ao buscar a viatura");
    }
}

/**
 * Busca a ocorrência associada a uma viatura específica
 * @param {number} viaturaId - ID da viatura
 * @returns {Object|null} - Retorna a ocorrência associada à viatura, ou null se não houver
 */
export async function getOcorrenciaByViaturaId(viaturaId) {
    try {
        const ocorrencia = await prisma.ocorrencia.findFirst({
            where: { idViatura: viaturaId },
            include: { localizacao: true } // Inclui a localização da ocorrência
        });

        return ocorrencia;
    } catch (error) {
        console.error("Erro ao buscar a ocorrência da viatura:", error);
        throw new Error("Erro ao buscar a ocorrência");
    }
}

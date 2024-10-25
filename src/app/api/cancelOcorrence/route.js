import { prisma } from '../../lib/prisma'; // Supondo que o Prisma esteja configurado

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { viaturaId } = req.body;

    try {
      // Busca a viatura para obter o ID da ocorrência associada
      const viatura = await prisma.viatura.findUnique({
        where: { id: viaturaId },
        select: { ocorrenciaId: true }, // Supondo que há um campo para armazenar a ocorrência ativa
      });

      if (!viatura || !viatura.ocorrenciaId) {
        return res.status(404).json({ error: "Ocorrência não encontrada para essa viatura." });
      }

      // Agora busca a ocorrência associada para obter o userId do usuário que fez o chamado
      const ocorrencia = await prisma.ocorrencia.findUnique({
        where: { id: viatura.ocorrenciaId },
        select: { userId: true }, // userId é o ID do usuário que fez o chamado (apertou SOS)
      });

      if (!ocorrencia || !ocorrencia.userId) {
        return res.status(404).json({ error: "Usuário que fez o chamado não encontrado." });
      }

      const userId = ocorrencia.userId;

      // Atualiza o statusChat da viatura
      await prisma.viatura.update({
        where: { id: viaturaId },
        data: { statusChat: false },
      });

      // Atualiza os statusChat e statusOcor do usuário que fez o chamado
      await prisma.user.update({
        where: { id: userId },
        data: {
          statusChat: false,
          statusOcor: false,
        },
      });

      res.status(200).json({ message: "Ocorrência cancelada com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao cancelar a ocorrência." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}

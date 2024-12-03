import prisma from '../../lib/prisma';

export async function POST(request, res) {
  try {
    const { viaturaId } = await request.json();
    console.log(`Viatura ID recebida: ${viaturaId}`);

    // Verifica se a viatura existe
    const viatura = await prisma.viatura.findUnique({
      where: { id: viaturaId },
      select: { id: true },
    });

    if (!viatura) {
      console.log(`Viatura não encontrada para o ID: ${viaturaId}`);
      return res.status(404).json({ error: "Viatura não encontrada." });
    }

    // Busca todas as ocorrências ativas associadas à viatura
    const ocorrencias = await prisma.ocorrencia.findMany({
      where: { viaturaId: viaturaId, status: true },
      select: { id: true, userId: true },
    });

    // Se não houver ocorrências ativas
    if (ocorrencias.length === 0) {
      console.log(`Nenhuma ocorrência ativa encontrada para a viatura com ID: ${viaturaId}`);
      return res.status(404).json({ error: "Nenhuma ocorrência ativa encontrada para essa viatura." });
    }

    console.log(`Ocorrências ativas encontradas: ${ocorrencias.length}`);

    // Loop para atualizar cada ocorrência e o usuário vinculado
    for (const ocorrencia of ocorrencias) {
      const { userId, id: ocorrenciaId } = ocorrencia;
      
      console.log(`Atualizando ocorrência ID: ${ocorrenciaId} para status FALSE`);
      
      // Atualiza o status da ocorrência para 'false'
      await prisma.ocorrencia.update({
        where: { id: ocorrenciaId },
        data: { status: false },
      });

      // Verifica se o usuário está presente e atualiza seu status
      if (userId) {
        console.log(`Atualizando usuário ID: ${userId} para statusChat FALSE e statusOcor FALSE`);

        await prisma.user.update({
          where: { id: userId },
          data: {
            statusChat: false,  // Desativa o status do chat
            statusOcor: false,  // Desativa o status da ocorrência
          },
        });
      }
    }

    // Atualiza o statusChat da viatura para FALSE
    console.log(`Atualizando statusChat da viatura ${viaturaId} para FALSE`);

    await prisma.viatura.update({
      where: { id: viaturaId },
      data: { statusChat: false },
    });

    return res.status(200).json({ message: "Ocorrências canceladas com sucesso." });
  } catch (error) {
    console.error('Erro ao cancelar as ocorrências:', error);
    return res.status(500).json({ error: "Erro ao cancelar as ocorrências." });
  }
};

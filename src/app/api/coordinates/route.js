import prisma from '../../lib/prisma';

export async function handler(req, res) {
  if (req.method === 'GET') {
    const { viaturaId, userId } = req.query;

    if (!viaturaId || !userId) {
      return res.status(400).json({ error: 'Viatura ou usuário não fornecidos' });
    }

    try {
      // Verifique a ocorrência associada à viatura
      const ocorrencia = await prisma.ocorrencia.findUnique({
        where: { viaturaId: Number(viaturaId) },
        select: { idUsuario: true, status: true },
      });

      if (!ocorrencia) {
        return res.status(404).json({ error: 'Ocorrência não encontrada' });
      }

      if (!ocorrencia.status) {
        // Se o status for false, não traça a rota, apenas retorna as coordenadas do usuário
        const usuario = await prisma.usuario.findUnique({
          where: { id: Number(userId) },
          select: { latitude: true, longitude: true },
        });

        if (!usuario) {
          return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        return res.status(200).json({
          status: false,
          userCoordinates: { latitude: usuario.latitude, longitude: usuario.longitude }
        });
      }

      // Se o status for true, então busca as coordenadas da viatura e do usuário
      const viatura = await prisma.viatura.findUnique({
        where: { id: Number(viaturaId) },
        select: { latitude: true, longitude: true },
      });

      if (!viatura) {
        return res.status(404).json({ error: 'Viatura não encontrada' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: ocorrencia.idUsuario },
        select: { latitude: true, longitude: true },
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.status(200).json({
        status: true,
        viaturaCoordinates: { latitude: viatura.latitude, longitude: viatura.longitude },
        userCoordinates: { latitude: usuario.latitude, longitude: usuario.longitude }
      });

    } catch (error) {
      console.error('Erro ao buscar coordenadas:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    // Método HTTP não permitido
    return res.status(405).json({ error: 'Método não permitido' });
  }
}

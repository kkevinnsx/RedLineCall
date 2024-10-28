import prisma from "../../lib/prisma"; // Importando o Prisma
import { pusher } from "../../lib/pusher";

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon1 - lon2) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, userLocation } = req.body;
    try {
      const responseViaturas = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/getVehicles`
      );
      const viaturas = await responseViaturas.json();

      if (!viaturas || viaturas.length === 0) {
        return res.status(404).json({
          message: "Nenhuma viatura disponível no momento.",
        });
      }

      let viaturaMaisProxima = null;
      let menorDistancia = Infinity;

      viaturas.forEach((viatura) => {
        const distancia = calcularDistancia(
          userLocation.latitude,
          userLocation.longitude,
          viatura.latitude,
          viatura.longitude
        );

        if (distancia < menorDistancia) {
          menorDistancia = distancia;
          viaturaMaisProxima = viatura;
        }
      });

      if (!viaturaMaisProxima) {
        return res.status(404).json({
          message: "Nenhuma viatura disponível.",
        });
      }

      const novaOcorrencia = await prisma.ocorrencia.create({
        data: {
          userId: userId,
          idViatura: viaturaMaisProxima.id,
          data: new Date(),
          motivo: "Em andamento",
        },
      });

      await pusher.trigger("sos-channel", "sos-alert", {
        userId,
        userLocation,
        viaturaId: viaturaMaisProxima.id,
      });

      res.status(200).json({
        message: "SOS enviado com sucesso!",
        ocorrencia: novaOcorrencia,
      });
    } catch (error) {
      console.error("Erro ao processar SOS:", error);
      res.status(500).json({ message: "Erro ao enviar o SOS" });
    }
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}

import prisma from "../../lib/prisma";
import { pusher } from "../../lib/pusher";
import { getUserProfile } from '../../../modules/auth/services/userService';
import { NextResponse } from 'next/server';

const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distância em km
};

export async function POST(request) {
  try {
    console.log("Recuperando perfil do usuário");
    const userProfile = await getUserProfile(request);
    if (!userProfile) {
      console.log("Usuário não encontrado");
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });
    }

    console.log("Recuperando dados da solicitação");
    const body = await request.json();
    if (!body || !body.latitude || !body.longitude) {
      throw new Error('Corpo da requisição inválido');
    }
    const { latitude, longitude } = body;
    const userLocation = { latitude, longitude };

    console.log("Atualizando localização e statusChat do usuário");
    await prisma.user.update({
      where: { id: userProfile.id },
      data: { latitude, longitude, statusChat: true },
    });

    console.log("Buscando viaturas disponíveis");
    const viaturas = await prisma.viatura.findMany({
      where: {
        status: true,
        statusChat: false,
      },
    });

    if (!viaturas || viaturas.length === 0) {
      console.log("Nenhuma viatura disponível no momento");
      return NextResponse.json({ message: "Nenhuma viatura disponível no momento." }, { status: 404 });
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
      return NextResponse.json({ message: "Nenhuma viatura disponível." }, { status: 404 });
    }

    console.log("Salvando localização na tabela localizacao");
    const novaLocalizacao = await prisma.localizacao.create({
      data: {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      },
    });

    console.log("Criando nova ocorrência na tabela ocorrencia");
    const novaOcorrencia = await prisma.ocorrencia.create({
      data: {
        data: new Date(),
        motivo: "X",
        idLocalizacao: novaLocalizacao.id,
        idUsuario: userProfile.id,
        idViatura: viaturaMaisProxima.id,
      },
    });

    console.log("Atualizando statusChat da viatura mais próxima");
    await prisma.viatura.update({
      where: { id: viaturaMaisProxima.id },
      data: { statusChat: true },
    });

    console.log("Atualizando statusOcor do usuário após criação da ocorrência");
    await prisma.user.update({
      where: { id: userProfile.id },
      data: { statusOcor: true },
    });

    console.log("Disparando evento via Pusher");
    await pusher.trigger("sos-channel", "sos-alert", {
      userId: userProfile.id,
      userLocation,
      viaturaId: viaturaMaisProxima.id,
    });

    console.log("SOS enviado com sucesso!");
    return NextResponse.json({ message: "SOS enviado com sucesso!", ocorrencia: novaOcorrencia }, { status: 200 });

  } catch (error) {
    console.error("Erro ao processar SOS:", error.message);
    return NextResponse.json({ message: "Erro ao enviar o SOS", details: error.message }, { status: 500 });
  }
}

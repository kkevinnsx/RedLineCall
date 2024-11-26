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
        const userProfile = await getUserProfile(request);
        if (!userProfile) {
            return NextResponse.json(
                { message: "Usuário não encontrado, faça login novamente!" },
                { status: 401 }
            );
        }

        const body = await request.json();
        if (!body.latitude || !body.longitude) {
            return NextResponse.json(
                { message: 'Latitude e longitude são obrigatórios para enviar o SOS.' },
                { status: 400 }
            );
        }

        const { latitude, longitude } = body;

        await prisma.user.update({
            where: { id: userProfile.id },
            data: { latitude, longitude, statusChat: true },
        });

        const viaturas = await prisma.viatura.findMany({
            where: {
                status: true,
                statusChat: false,
            },
        });

        if (!viaturas || viaturas.length === 0) {
            return NextResponse.json(
                { message: "Nenhuma viatura disponível para atendimento." },
                { status: 404 }
            );
        }

        let viaturaMaisProxima = null;
        let menorDistancia = Infinity;

        viaturas.forEach((viatura) => {
            const distancia = calcularDistancia(
                latitude,
                longitude,
                viatura.latitude,
                viatura.longitude
            );
            if (distancia < menorDistancia) {
                menorDistancia = distancia;
                viaturaMaisProxima = viatura;
            }
        });

        if (!viaturaMaisProxima) {
            return NextResponse.json(
                { message: "Nenhuma viatura encontrada próxima à sua localização." },
                { status: 404 }
            );
        }

        const novaLocalizacao = await prisma.localizacao.create({
            data: { latitude, longitude },
        });

        const novaOcorrencia = await prisma.ocorrencia.create({
            data: {
                data: new Date(),
                motivo: "X",
                idLocalizacao: novaLocalizacao.id,
                idUsuario: userProfile.id,
                idViatura: viaturaMaisProxima.id,
            },
        });

        await prisma.viatura.update({
            where: { id: viaturaMaisProxima.id },
            data: { statusChat: true },
        });

        await prisma.user.update({
            where: { id: userProfile.id },
            data: { statusOcor: true },
        });

        await pusher.trigger("sos-channel", "sos-alert", {
            userId: userProfile.id,
            userLocation: { latitude, longitude },
            viaturaId: viaturaMaisProxima.id,
        });

        return NextResponse.json(
            { message: "SOS enviado com sucesso!", ocorrencia: novaOcorrencia },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao processar a solicitação.", details: error.message },
            { status: 500 }
        );
    }
}

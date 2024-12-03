// osrmService.js
import prisma from '../lib/prisma';
import fetch from 'node-fetch';

export async function getViaturaAndUserCoordinates(viaturaId, userId) {
  try {
    const ocorrencia = await prisma.ocorrencia.findUnique({
      where: { viaturaId },
      select: { status: true, idUsuario: true },
    });

    if (!ocorrencia) {
      throw new Error('Ocorrência não encontrada');
    }

    if (!ocorrencia.status) {
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        select: { latitude: true, longitude: true },
      });

      if (!usuario) {
        throw new Error('Usuário não encontrado');
      }

      return {
        status: false,
        userCoordinates: { latitude: usuario.latitude, longitude: usuario.longitude },
      };
    }

    const viatura = await prisma.viatura.findUnique({
      where: { id: viaturaId },
      select: { latitude: true, longitude: true },
    });

    if (!viatura) {
      throw new Error('Viatura não encontrada');
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: ocorrencia.idUsuario },
      select: { latitude: true, longitude: true },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    return {
      status: true,
      viaturaCoordinates: { latitude: viatura.latitude, longitude: viatura.longitude },
      userCoordinates: { latitude: usuario.latitude, longitude: usuario.longitude },
    };
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    throw error;
  }
}

export async function getRoute(viaturaCoordinates, userCoordinates) {
  try {
    const { latitude: viaturaLat, longitude: viaturaLng } = viaturaCoordinates;
    const { latitude: userLat, longitude: userLng } = userCoordinates;

    const url = `http://router.project-osrm.org/route/v1/driving/${viaturaLng},${viaturaLat};${userLng},${userLat}?overview=full&geometries=geojson`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Erro ao obter a rota do OSRM');
    }

    const data = await response.json();
    return data.routes[0].geometry.coordinates;
  } catch (error) {
    console.error('Erro ao traçar a rota:', error);
    throw error;
  }
}

import { NextResponse } from 'next/server';
import { pusher } from '../../lib/pusher';
import { getRoute } from '../../utils/osrmService';

const MAX_PAYLOAD_SIZE = 10240;

function splitRoute(route) {
  const parts = [];
  let currentPart = { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} };

  route.geometry.coordinates.forEach(coord => {
    if (currentPart.geometry.coordinates.length >= 1000) {
      parts.push(currentPart);
      currentPart = { type: 'Feature', geometry: { type: 'LineString', coordinates: [] }, properties: {} };
    }
    currentPart.geometry.coordinates.push(coord);
  });

  if (currentPart.geometry.coordinates.length > 0) {
    parts.push(currentPart);
  }

  return parts;
}

export async function POST(request) {
  try {
    const { viatura, usuario } = await request.json();

    if (!viatura || !usuario) {
      throw new Error("Dados insuficientes para traçar a rota.");
    }

    const route = await getRoute(viatura, usuario);
    const routeParts = splitRoute(route);

    for (const part of routeParts) {
      await pusher.trigger("vehicle-location", "update-route", { newRoute: part });
    }

    return NextResponse.json({ message: "Rota traçada com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar a rota:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

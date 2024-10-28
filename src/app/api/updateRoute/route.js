import { NextResponse } from 'next/server';
import { pusher } from '../../lib/pusher';

export async function POST(request) {
  try {
    const { route } = await request.json();
    console.log('Tentando atualizar a rota:', route);

    if (!route) {
      throw new Error('A rota não foi fornecida.');
    }

    await pusher.trigger('vehicle-location', 'update-route', { newRoute: route });
    console.log('Rota atualizada com sucesso!');
    return NextResponse.json({ message: 'Rota atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar a rota:', error);
    return NextResponse.json({ error: 'Erro ao atualizar a rota', details: error.message }, { status: 500 });
  }
}

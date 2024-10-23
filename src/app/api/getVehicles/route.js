import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const viaturas = await prisma.viatura.findMany({
      where: {
        status: true, // Status de disponibilidade
      },
      select: {
        id: true,
        numeroViatura: true,
        modeloViatura: true,
        latitude: true,
        longitude: true,
        placaViatura: true,
      }
    });

    return NextResponse.json(viaturas);
  } catch (error) {
    console.error('Erro ao buscar viaturas:', error);
    return NextResponse.json({ error: 'Erro ao buscar viaturas' }, { status: 500 });
  }
}

import { jwtVerify } from "jose";
import prisma from '../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(request){
    const sessionCookie = request.cookies.get('session');

    if(!sessionCookie){
        return NextResponse.json({error: 'Usuário não autenticado'}, {status: 401});
    }

    const { value } = sessionCookie;
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

    try {
        const { payload } = await jwtVerify(value, secret);
        const userId = payload.sub;

        const user = await prisma.user.findUnique({
            where: { id: userId},
            select: {
                latitude: true,
                longitude: true,
                viaturas: {
                    select: {
                        latitude: true,
                        longitude: true,
                        numeroViatura: true,
                        modeloViatura: true,
                        placaViatura: true,
                    }
                }
            }
        });

        if(!user){
            return NextResponse.json({error: 'Usuario não encontrado'}, {status: 401});
        }

        const vehicle = user.viaturas.length > 0 ? user.viaturas[0] : null;

        return NextResponse.json({
            userLocation: {
                latitude: user.latitude,
                longitude: user.longitude,
            },
            vehicleLocation: vehicle ? {
                latitude: vehicle.latitude,
                longitude: vehicle.longitude,
                numeroViatura: vehicle.numeroViatura,
                modeloViatura: vehicle.modeloViatura,
                placaViatura: vehicle.placaViatura,
            }
            : null,
        });
    } catch (error) {
        console.error('Erro ao verificar token ou buscar dados: ', error);
        return NextResponse.json({error: 'Erro ao buscar dados', details: error.message}, {status: 500})
    }
}
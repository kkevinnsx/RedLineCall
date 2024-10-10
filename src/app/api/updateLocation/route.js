import prisma from '../../lib/prisma';
import { NextResponse } from "next/server";
import { getUserProfile } from "../../../modules/auth/services/userService";

export async function POST(req){
    try {
        const userProfile = await getUserProfile(req);
        if(!userProfile){
            return NextResponse.json({ error: 'Não autorizado!'}, {status: 401});
        }

        const {latitude, longitude} = await req.json();
        if(!latitude || !longitude){
            return NextResponse.json({error: 'É exigido latitude e longitude para continuar'}, {status:400});
        }

        const updateUser = await prisma.user.update({
            where: { id: userProfile.id},
            data: {
                latitude,
                longitude,
            },
        });
    
        return NextResponse.json({message: 'Localização atualizada com sucesso', data: updateUser});
    } catch (error) {
        console.error('erro ao atualizar a localização', error);
        return NextResponse.json({ error: 'Internal Server Error'}, {status: 500});
    }
}
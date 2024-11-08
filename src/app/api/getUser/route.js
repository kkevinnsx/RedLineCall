import prisma from "../../lib/prisma";
import { getUserProfile } from "../../../modules/auth/services/userService";

export async function GET(req) {
  try {
    const userProfile = await getUserProfile(req);
    const userId = parseInt(userProfile.id, 10);

    const user = await prisma.user.findUnique({
      where: { id: userId },  
      select: { fullName: true }  
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Nome do usuário não encontrado' }), { status: 404 });
    }

    const ocorrencias = await prisma.ocorrencia.findMany({
      where: { idUsuario: userId},
      select: {
        data: true,
        motivo: true,
        localizacao: {
          select: {
            latitude: true,
            longitude: true,
          }
        }
      },
    orderBy: { data: 'desc'}
    });

    return new Response(JSON.stringify({ fullName: user.fullName, ocorrencias, }), { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const userProfile = await getUserProfile(req);
    const userId = parseInt(userProfile.id, 10);

    const { currentEmail, newEmail } = await req.json();
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true},
    });

    if(!user){
      return new Response(JSON.stringify({ error: 'Usuário não encontrado '}), {status: 404});
    }

    if(user.email !== currentEmail) {
      return new Response(JSON.stringify({ error: 'O e-mail atual está incorreto'}), {status: 400})
    }

    await prisma.user.update({
      where: { id: userId },
      data:  { email: newEmail}, 
    });

    return new Response(JSON.stringify({ success: true}), {status:200});
  } catch (error) {
    console.error('Erro ao alterar o e-mail: ', error);
    return new Response(
      JSON.stringify({ error: 'Erro iterno ao servidor', details: error.message}),
      {status: 500}
    );
  }
}
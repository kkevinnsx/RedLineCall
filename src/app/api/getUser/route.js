import prisma from "../../lib/prisma";
import { getUserProfile } from "../../../modules/auth/services/userService";

export async function GET(req) {
  try {
    const userProfile = await getUserProfile(req);

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userProfile.id, 10) },  
      select: { fullName: true }  
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Nome do usuário não encontrado' }), { status: 404 });
    }

    return new Response(JSON.stringify({ fullName: user.fullName }), { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor', details: error.message }),
      { status: 500 }
    );
  }
}

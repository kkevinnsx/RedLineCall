import prisma from "../../lib/prisma";
import { getUserProfile } from "../../../modules/auth/services/userService";
import { destroySession } from "@/modules/auth/services/authService";
import * as bcrypt from 'bcrypt';
import { NextResponse } from "next/server";

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

    const { currentEmail, newEmail, cep, number, cpf, newPassword, confirmPassword, deleteAccount} = await req.json();
    

    if(currentEmail && newEmail) {
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
  }
  
  if(cep && number) {
    await prisma.user.update({
      where: {id: userId},
      data:  {cep, number },
    });

    return new Response(JSON.stringify({success: true, message: 'Endereço atualizado com sucesso!'}), {status: 200}); 
  }

  if(cpf && newPassword && confirmPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {cpf: true},
    });
  
  if (!user || user.cpf !== cpf) {
    return new Response(JSON.stringify({error: 'CPF incorreto'}), {status: 400});
  }

  if(newPassword !== confirmPassword) {
    return new Response(JSON.stringify({error: 'As senhas não correspondem'}), {status: 400});
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: {id: userId},
    data: { password: hashPassword},
  });

    return new Response(JSON.stringify({success: true, message: 'senha alterada com sucesso!'}),{status:200})
  }

  if(deleteAccount){
    await prisma.user.delete({
      where: {id: userId},
    });

    await destroySession(req)

    return new Response(JSON.stringify({ success: true, message: 'Conta deletada com sucesso!' }), { status: 200 });
  }

    return new Response(
      JSON.stringify({ error: 'Dados insuficientes para atualização'}),
      {status: 400}
    );
  } catch (error) {
    console.error('Erro ao alterar os dados: ', error);
    return new Response(
      JSON.stringify({ error: 'Erro interno ao servidor', details: error.message}),
      {status: 500}
    );
  }
}
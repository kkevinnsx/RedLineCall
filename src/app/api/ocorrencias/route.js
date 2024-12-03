import { getUserProfile } from "../../../modules/auth/services/userService";
import prisma from '../../lib/prisma';

async function getLoggedVehicleId(req) {
  const policeProfile = await getUserProfile(req);

  if (!policeProfile || typeof policeProfile.id !== "number") {
    console.error("Perfil do usuário inválido:", policeProfile);
    throw new Error("Usuário não está autenticado ou perfil inválido.");
  }

  if (policeProfile.idPerfil !== 'B') {
    console.error("Apenas usuários com perfil 'B' podem acessar esta funcionalidade.");
    throw new Error("Perfil do usuário não autorizado.");
  }

  const viatura = await prisma.viatura.findFirst({
    where: { responsavelId: policeProfile.id },
    select: { id: true, latitude: true, longitude: true },
  });

  if (!viatura) {
    throw new Error("Nenhuma viatura está associada a este usuário.");
  }

  return viatura;
}

export async function GET(req) {
  try {
    const viatura = await getLoggedVehicleId(req);

    const ocorrencia = await prisma.ocorrencia.findFirst({
      where: { idViatura: viatura.id, status: true },
      select: { id: true, idViatura: true, idUsuario: true, status: true },
    });

    if (!ocorrencia) {
      console.log("Nenhuma ocorrência com status true encontrada.");
      return new Response(
        JSON.stringify({ error: "Não foi encontrada uma ocorrência com status true." }),
        { status: 404 }
      );
    }

    console.log("Ocorrência encontrada:");
    console.log(`Status da Ocorrência: ${ocorrencia.status}`);
    console.log(`ID da Ocorrência: ${ocorrencia.id}`);
    console.log(`ID da Viatura: ${ocorrencia.idViatura}`);
    console.log(`ID do Usuário: ${ocorrencia.idUsuario}`);

    const viaturaData = await prisma.viatura.findUnique({
      where: { id: ocorrencia.idViatura },
      select: { latitude: true, longitude: true },
    });

    const usuarioData = await prisma.user.findUnique({
      where: { id: ocorrencia.idUsuario },
      select: { latitude: true, longitude: true },
    });

    console.log(`Latitude da Viatura: ${viaturaData.latitude}`);
    console.log(`Longitude da Viatura: ${viaturaData.longitude}`);
    console.log(`Latitude do Usuário: ${usuarioData.latitude}`);
    console.log(`Longitude do Usuário: ${usuarioData.longitude}`);

    return new Response(
      JSON.stringify({
        viatura: { latitude: viaturaData.latitude, longitude: viaturaData.longitude },
        usuario: { latitude: usuarioData.latitude, longitude: usuarioData.longitude },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao buscar ocorrências:", error);
    const status = error.message.includes("autenticado") ? 401 :
                   error.message.includes("viatura") ? 404 : 500;
    return new Response(JSON.stringify({ error: error.message }), { status });
  }
}

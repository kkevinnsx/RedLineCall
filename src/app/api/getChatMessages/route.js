import prisma from "../../lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const idChat = searchParams.get("idChat");

  if (!idChat) {
    return new Response(JSON.stringify({ message: "ID do chat é necessário" }), {
      status: 400,
    });
  }

  try {
    const mensagens = await prisma.mensagem.findMany({
      where: { idChat },
      orderBy: { dataEnvio: "asc" },
    });

    return new Response(JSON.stringify(mensagens), { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar mensagens:", error);
    return new Response(
      JSON.stringify({ message: "Erro ao buscar mensagens" }),
      { status: 500 }
    );
  }
}

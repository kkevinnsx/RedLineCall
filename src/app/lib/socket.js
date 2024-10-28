import { Server } from "socket.io";

export function setupSocket(server) {
  if (!server.io) {
    const io = new Server(server, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
      console.log("Usuário conectado", socket.id);

      socket.on("sos", (data) => {
        console.log("SOS ativado pelo usuário:", data);
      });

      socket.on("disconnect", () => {
        console.log("Usuário desconectado", socket.id);
      });
    });

    server.io = io;
  }
}

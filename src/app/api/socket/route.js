import { Server } from "socket.io";

let io;

export default function handler(req, res) {
  if (!io) {
    io = new Server(res.socket.server, {
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

    res.socket.server.io = io;
  }

  res.end();
}

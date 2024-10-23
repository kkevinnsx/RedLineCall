// pages/api/SOSbutton.js
import { pusher } from "../../services/pusher";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, userLocation } = req.body;

    pusher.trigger("sos-channel", "sos-alert", {
      userId,
      userLocation,
    });

    res.status(200).json({ message: "SOS enviado com sucesso!" });
  } else {
    res.status(405).json({ message: "Método não permitido" });
  }
}

import mailService from "../services/Mail.service.js";
import Persona from "../models/Persona.js";

async function enviarMailPedido(req, res) {
  try {
    const { nroPedido, responsableLegajo, asunto, mensaje } = req.body;

    // Obtener email del responsable
    const responsable = await Persona.findByPk(responsableLegajo);
    if (!responsable) return res.status(404).json({ message: "Responsable no encontrado" });

    // Enviar mail
    const resultado = await mailService.enviarMail(
      responsable.correo,
      asunto,
      mensaje
    );

    if (resultado.success) {
      res.json({ message: "Mail enviado correctamente" });
    } else {
      res.status(500).json({ message: "Error enviando mail", error: resultado.error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor", error });
  }
}

export default {
  enviarMailPedido,
};

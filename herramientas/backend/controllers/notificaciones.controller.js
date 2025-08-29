// controllers/notificacion.controller.js
import notificadorService from "../services/Notificaciones.service.js";

async function getAll(req, res) {
  try {
    const notificaciones = notificadorService.listarNotificaciones();
    res.json(notificaciones);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error al obtener notificaciones" });
  }
}

async function marcarLeida(req, res) {
  try {
    const { id } = req.params;
    const notificacion = notificadorService.marcarComoLeida(id);
    if (!notificacion) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }
    res.json(notificacion);
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    res.status(500).json({ error: "Error al actualizar notificación" });
  }
}

export default {
  getAll,
  marcarLeida,
};

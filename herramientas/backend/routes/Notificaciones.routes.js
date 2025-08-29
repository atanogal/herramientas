// routes/notificacion.routes.js
import { Router } from "express";
import notificacionController from "../controllers/notificaciones.controller.js";

const router = Router();

// Obtener todas las notificaciones
router.get("/", notificacionController.getAll);

// Marcar una notificación como leída
router.put("/:id/leida", notificacionController.marcarLeida);

export default router;

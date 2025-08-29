// routes/bolso.routes.js
import { Router } from "express";
import BolsoController from "../controllers/Bolso.controller.js";

const router = Router();

router.get("/", BolsoController.getAll);
router.get("/:nroBolso", BolsoController.getById);
router.post("/", BolsoController.create);
router.put("/:nroBolso", BolsoController.update);
router.delete("/:nroBolso", BolsoController.remove);

// opcional extra: detalles de un bolso
router.get("/:nroBolso/detalles", BolsoController.getDetalles);

export default router;

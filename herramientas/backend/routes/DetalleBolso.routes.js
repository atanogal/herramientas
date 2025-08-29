import { Router } from "express";
import DetalleBolsoController from "../controllers/DetalleBolso.controller.js";

const router = Router();

router.get("/", DetalleBolsoController.getAll);

// ✅ esta ruta tiene que ir antes de la doble
router.get("/bolso/:nroBolso", DetalleBolsoController.getByBolso);

router.get("/:nroBolso/:nroHerramienta", DetalleBolsoController.getById);
router.post("/", DetalleBolsoController.create);
router.put("/:nroBolso/:nroHerramienta", DetalleBolsoController.update);
router.delete("/:nroBolso/:nroHerramienta", DetalleBolsoController.remove);

export default router;

import { Router } from "express";
import EstadoController from "../controllers/estado.controller.js";

const router = Router();

router.get("/", EstadoController.getAll);
router.get("/:nroEstado", EstadoController.getById);
router.post("/", EstadoController.create);
router.put("/:nroEstado", EstadoController.update);

export default router;

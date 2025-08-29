import { Router } from "express";
import TipoHerramientaController from "../controllers/tipoHerramienta.controller.js";

const router = Router();

router.get("/", TipoHerramientaController.getAll);
router.get("/:nroTipoHerramienta", TipoHerramientaController.getById);
router.post("/", TipoHerramientaController.create);
router.put("/:nroTipoHerramienta", TipoHerramientaController.update);
router.delete("/:nroTipoHerramienta", TipoHerramientaController.delete);

export default router;

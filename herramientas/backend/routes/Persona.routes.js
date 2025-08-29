// routes/persona.routes.js
import { Router } from "express";
import PersonaController from "../controllers/Persona.controller.js";

const router = Router();

router.get("/", PersonaController.getAll);
router.get("/:legajo", PersonaController.getById);
router.post("/", PersonaController.create);
router.put("/:legajo", PersonaController.update);
router.delete("/:legajo", PersonaController.remove);

export default router;

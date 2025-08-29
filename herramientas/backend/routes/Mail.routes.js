import { Router } from "express";
import mailController from "../controllers/mail.controller.js";

const router = Router();

// POST /mail/pedido
router.post("/pedido", mailController.enviarMailPedido);

export default router;

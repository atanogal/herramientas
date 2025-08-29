import { Router } from "express";
import DetallePedidoController from "../controllers/detallePedido.controller.js";

const router = Router();

router.get("/", DetallePedidoController.getAll);
router.get("/:id", DetallePedidoController.getById);
router.patch("/:id/estado", DetallePedidoController.updateEstado);

export default router;

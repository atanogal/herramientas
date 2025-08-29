import { Router } from "express";
import PedidoController from "../controllers/pedido.controller.js";

const router = Router();

// Pedidos generales
router.get("/", PedidoController.getAll);

// Obtener un pedido por nroPedido
router.get("/:nroPedido", PedidoController.getById);

// Obtener detalles de un pedido por nroPedido
router.get("/:nroPedido/detalles", PedidoController.getDetallesPorPedido);

// Crear pedido principal
router.post("/main", PedidoController.createMain);

// Agregar detalles a un pedido por nroPedido
router.post("/:nroPedido/detalles", PedidoController.addDetalles);

// Crear pedido completo
router.post("/", PedidoController.create);

// Actualizar un pedido por nroPedido
router.put("/:nroPedido", PedidoController.update);

// Actualizar estado de un detalle (mantiene id del detalle)
router.patch("/detalle/:id/estado", PedidoController.actualizarEstadoDetalle);

export default router;

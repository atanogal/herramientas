import PedidoService from "../services/Pedido.service.js";
import Pedido from "../models/Pedido.js";
import DetallePedido from "../models/DetallePedido.js"; // faltaba esta importación para actualizarEstadoDetalle
import Herramienta from "../models/Herramienta.js";

const PedidoController = {
  async getAll(req, res) {
    try {
      const pedidos = await PedidoService.getAll();
      res.json(pedidos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const pedido = await PedidoService.getById(req.params.nroPedido);
      if (!pedido) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      res.json(pedido);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const nuevoPedido = await PedidoService.create(req.body);
      res.status(201).json(nuevoPedido);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const pedidoActualizado = await PedidoService.update(
        req.params.nroPedido,
        req.body
      );
      if (!pedidoActualizado) {
        return res.status(404).json({ message: "Pedido no encontrado" });
      }
      res.json(pedidoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Nuevo: crea solo pedido principal
  async createMain(req, res) {
    try {
      console.log("Datos recibidos para crear pedido:", req.body);
      const nuevoPedido = await PedidoService.createMain(req.body);
      res.status(201).json(nuevoPedido);
    } catch (error) {
      console.error("Error creando pedido en createMain:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Nuevo: agrega detalles a pedido existente
async addDetalles(req, res) {
    try {
      console.log("req.params:", req.params);  // Para depurar
      const { nroPedido } = req.params;

      // Puede venir como array directo o dentro de objeto { detalles: [...] }
      const detalles = Array.isArray(req.body) ? req.body : req.body.detalles;

      if (!Array.isArray(detalles)) {
        return res.status(400).json({ message: "El campo detalles debe ser un array" });
      }

      const detallesCreados = await PedidoService.addDetalles(nroPedido, detalles);
      res.status(201).json(detallesCreados);
    } catch (error) {
      console.error("Error en addDetalles:", error);
      res.status(500).json({ error: error.message });
    }
  },


  async getDetallesPorPedido(req, res) {
    const { nroPedido } = req.params;
    try {
      const detalles = await PedidoService.getDetallesPorPedido(nroPedido);
      if (!detalles || detalles.length === 0) {
        return res.status(404).json({ message: "No se encontraron detalles para este pedido" });
      }
      res.json(detalles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener detalles del pedido" });
    }
  },

  async actualizarEstadoDetalle(req, res) {
    try {
      const idDetalle = req.params.id;
      const { nroEstado } = req.body;

      // 1️⃣ Actualizar el estado del detalle
      const detalle = await DetallePedido.findByPk(idDetalle);
      if (!detalle) return res.status(404).json({ error: "Detalle no encontrado" });

      await detalle.update({ nroEstado });

      // 2️⃣ Actualizar el estado de la herramienta asociada
      if (detalle.nroHerramienta) {
        const herramienta = await Herramienta.findByPk(detalle.nroHerramienta);
        if (herramienta) {
          // Asignar el estado "pteAsignar" (cambia por tu nroEstado correspondiente)
          await herramienta.update({ nroEstado: 1 }); // ej: 1 = pteAsignar
        }
      }

      // 3️⃣ Recalcular el estado del pedido principal según detalles
      const nroPedido = detalle.nroPedido;
      await PedidoService.actualizarEstadoSegunDetalles(nroPedido);

      res.json({ message: "Estado detalle actualizado y herramienta marcada como pteAsignar" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar estado del detalle" });
    }
  },
};

export default PedidoController;

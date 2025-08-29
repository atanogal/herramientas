import DetallePedidoService from "../services/DetallePedido.service.js";

const DetallePedidoController = {
  async getAll(req, res) {
    try {
      const detalles = await DetallePedidoService.getAll();
      res.json(detalles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const detalle = await DetallePedidoService.getByDetalleId(req.params.id);
      if (!detalle) {
        return res.status(404).json({ message: "Detalle de pedido no encontrado" });
      }
      res.json(detalle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateEstado(req, res) {
    try {
      const { id } = req.params;
      const { nroEstado } = req.body;

      if (!nroEstado) {
        return res.status(400).json({ message: "Falta nroEstado en el cuerpo de la petición" });
      }

      const detalleActualizado = await DetallePedidoService.updateEstado(id, nroEstado);
      if (!detalleActualizado) {
        return res.status(404).json({ message: "Detalle de pedido no encontrado para actualizar" });
      }
      res.json(detalleActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default DetallePedidoController;

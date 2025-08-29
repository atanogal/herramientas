import DetalleBolsoService from "../services/DetalleBolso.service.js";

const DetalleBolsoController = {
  async getAll(req, res) {
    try {
      const detalles = await DetalleBolsoService.getAll();
      res.json(detalles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener detalles" });
    }
  },

  async getById(req, res) {
    try {
      const { nroBolso, nroHerramienta } = req.params;
      const detalle = await DetalleBolsoService.getById(nroBolso, nroHerramienta);
      if (!detalle) return res.status(404).json({ message: "Detalle no encontrado" });
      res.json(detalle);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener detalle" });
    }
  },

  async create(req, res) {
    try {
      const nuevo = await DetalleBolsoService.create(req.body);
      res.status(201).json(nuevo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al crear detalle" });
    }
  },

  async update(req, res) {
    try {
      const { nroBolso, nroHerramienta } = req.params;
      const actualizado = await DetalleBolsoService.update(
        nroBolso,
        nroHerramienta,
        req.body
      );
      if (!actualizado) return res.status(404).json({ message: "Detalle no encontrado" });
      res.json(actualizado);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar detalle" });
    }
  },

  async remove(req, res) {
    try {
      const { nroBolso, nroHerramienta } = req.params;
      const eliminado = await DetalleBolsoService.remove(nroBolso, nroHerramienta);
      if (!eliminado) return res.status(404).json({ message: "Detalle no encontrado" });
      res.json({ message: "Detalle eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar detalle" });
    }
  },
  async getByBolso(req, res) {
  try {
    const { nroBolso } = req.params;
    const detalles = await DetalleBolsoService.getByBolso(nroBolso);
    if (!detalles || detalles.length === 0) {
      return res.status(404).json({ message: "No hay herramientas en este bolso" });
    }
    res.json(detalles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener herramientas del bolso" });
  }
},

};

export default DetalleBolsoController;

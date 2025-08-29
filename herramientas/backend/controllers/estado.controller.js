import EstadoService from "../services/Estado.service.js";

const EstadoController = {
  async getAll(req, res) {
    try {
      const estados = await EstadoService.getAll();
      res.json(estados);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const estado = await EstadoService.getById(req.params.nroEstado);
      if (!estado) {
        return res.status(404).json({ message: "Estado no encontrado" });
      }
      res.json(estado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const nuevoEstado = await EstadoService.create(req.body);
      res.status(201).json(nuevoEstado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const estadoActualizado = await EstadoService.update(
        req.params.nroEstado,
        req.body
      );
      if (!estadoActualizado) {
        return res.status(404).json({ message: "Estado no encontrado" });
      }
      res.json(estadoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default EstadoController;

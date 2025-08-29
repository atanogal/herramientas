import TipoHerramientaService from "../services/TipoHerramienta.service.js";

const TipoHerramientaController = {
  async getAll(req, res) {
    try {
      const tipos = await TipoHerramientaService.getAll();
      res.json(tipos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const tipo = await TipoHerramientaService.getById(req.params.nroTipoHerramienta);
      if (!tipo) {
        return res.status(404).json({ message: "Tipo de herramienta no encontrado" });
      }
      res.json(tipo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const nuevoTipo = await TipoHerramientaService.create(req.body);
      res.status(201).json(nuevoTipo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      const tipoActualizado = await TipoHerramientaService.update(
        req.params.nroTipoHerramienta,
        req.body
      );
      if (!tipoActualizado) {
        return res.status(404).json({ message: "Tipo de herramienta no encontrado" });
      }
      res.json(tipoActualizado);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const tipoEliminado = await TipoHerramientaService.delete(req.params.nroTipoHerramienta);
      if (!tipoEliminado) {
        return res.status(404).json({ message: "Tipo de herramienta no encontrado" });
      }
      res.json({ message: "Tipo de herramienta eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default TipoHerramientaController;

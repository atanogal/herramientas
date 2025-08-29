// controllers/Persona.controller.js
import PersonaService from "../services/Persona.service.js";

const PersonaController = {
  async getAll(req, res) {
    try {
      const personas = await PersonaService.getAll();
      res.json(personas);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getById(req, res) {
    try {
      const { legajo } = req.params;
      const persona = await PersonaService.getById(legajo);
      if (!persona) return res.status(404).json({ message: "Persona no encontrada" });
      res.json(persona);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const persona = await PersonaService.create(req.body);
      res.status(201).json(persona);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const { legajo } = req.params;
      const persona = await PersonaService.update(legajo, req.body);
      if (!persona) return res.status(404).json({ message: "Persona no encontrada" });
      res.json(persona);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },

  async remove(req, res) {
    try {
      const { legajo } = req.params;
      const ok = await PersonaService.remove(legajo);
      if (!ok) return res.status(404).json({ message: "Persona no encontrada" });
      res.json({ message: "Persona eliminada" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};

export default PersonaController;

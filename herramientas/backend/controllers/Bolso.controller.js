// controllers/Bolso.controller.js
import BolsoService from "../services/Bolso.service.js";
import DetalleBolsoService from "../services/DetalleBolso.service.js";

const BolsoController = {
  async getAll(req, res) {
    try {
      const bolsos = await BolsoService.getAll();
      res.json(bolsos);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getById(req, res) {
    try {
      const { nroBolso } = req.params;
      const bolso = await BolsoService.getById(nroBolso);
      if (!bolso) return res.status(404).json({ message: "Bolso no encontrado" });
      res.json(bolso);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async create(req, res) {
    try {
      const bolso = await BolsoService.create(req.body);
      res.status(201).json(bolso);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },

  async update(req, res) {
    try {
      const { nroBolso } = req.params;
      const bolso = await BolsoService.update(nroBolso, req.body);
      if (!bolso) return res.status(404).json({ message: "Bolso no encontrado" });
      res.json(bolso);
    } catch (e) {
      res.status(e.status || 500).json({ error: e.message });
    }
  },

  async remove(req, res) {
    try {
      const { nroBolso } = req.params;
      const ok = await BolsoService.remove(nroBolso);
      if (!ok) return res.status(404).json({ message: "Bolso no encontrado" });
      res.json({ message: "Bolso eliminado" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // opcional: listar detalles de un bolso
  async getDetalles(req, res) {
    try {
      const { nroBolso } = req.params;
      const detalles = await DetalleBolsoService.getByBolso(nroBolso);
      res.json(detalles);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
};

export default BolsoController;

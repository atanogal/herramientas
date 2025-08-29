// services/DetalleBolso.service.js
import DetalleBolso from "../models/DetalleBolso.js";
import Bolso from "../models/Bolso.js";
import Herramienta from "../models/Herramienta.js";

const DetalleBolsoService = {
  async getAll() {
    return DetalleBolso.findAll({
      include: [{ model: Bolso }, { model: Herramienta }],
      order: [["nroBolso", "ASC"]],
    });
  },

  async getById(nroBolso, nroHerramienta) {
    return DetalleBolso.findOne({
      where: { nroBolso, nroHerramienta },
      include: [{ model: Bolso }, { model: Herramienta }],
    });
  },

  async create(data) {
    // data = { nroBolso, nroHerramienta }
    return DetalleBolso.create(data);
  },

  async update(nroBolso, nroHerramienta, data) {
    const detalle = await DetalleBolso.findOne({
      where: { nroBolso, nroHerramienta },
    });
    if (!detalle) return null;
    await detalle.update(data);
    return detalle;
  },

  async remove(nroBolso, nroHerramienta) {
    const detalle = await DetalleBolso.findOne({
      where: { nroBolso, nroHerramienta },
    });
    if (!detalle) return false;
    await detalle.destroy();
    return true;
  },

  async getByBolso(nroBolso) {
    return DetalleBolso.findAll({
      where: { nroBolso },
      include: [{ model: Herramienta }],
    });
  },
};

export default DetalleBolsoService;

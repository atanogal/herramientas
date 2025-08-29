// services/Bolso.service.js
import Bolso from "../models/Bolso.js";
import Persona from "../models/Persona.js";
import DetalleBolso from "../models/DetalleBolso.js";
import Herramienta from "../models/Herramienta.js";

const BolsoService = {
  async getAll() {
    return Bolso.findAll({
      include: [
        { model: Persona, attributes: ["legajo", "nombre", "correo"] },
        {
          model: DetalleBolso,
          include: [{ model: Herramienta }],
        },
      ],
      order: [["nroBolso", "ASC"]],
    });
  },

  async getById(nroBolso) {
    return Bolso.findByPk(nroBolso, {
      include: [
        { model: Persona, attributes: ["legajo", "nombre", "correo"] },
        {
          model: DetalleBolso,
          include: [{ model: Herramienta }],
        },
      ],
    });
  },

  async create(data) {
    // data: { legajo }
    // (opcional) validar que Persona exista:
    const persona = await Persona.findByPk(data.legajo);
    if (!persona) {
      const err = new Error("La persona (legajo) no existe");
      err.status = 400;
      throw err;
    }
    return Bolso.create(data);
  },

  async update(nroBolso, data) {
    const bolso = await Bolso.findByPk(nroBolso);
    if (!bolso) return null;

    if (data.legajo) {
      const persona = await Persona.findByPk(data.legajo);
      if (!persona) {
        const err = new Error("La persona (legajo) no existe");
        err.status = 400;
        throw err;
      }
    }

    await bolso.update(data);
    return bolso;
  },

  async remove(nroBolso) {
    const bolso = await Bolso.findByPk(nroBolso);
    if (!bolso) return false;
    await bolso.destroy(); // CASCADE eliminará DetalleBolsos si lo configuraste
    return true;
  },
};

export default BolsoService;

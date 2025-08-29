// services/Persona.service.js
import Persona from "../models/Persona.js";
import Bolso from "../models/Bolso.js";

const PersonaService = {
  async getAll() {
    return Persona.findAll({
      include: [{ model: Bolso }],
      order: [["legajo", "ASC"]],
    });
  },

  async getById(legajo) {
    return Persona.findByPk(legajo, {
      include: [{ model: Bolso }],
    });
  },

  async create(data) {
    // data: { legajo, nombre, correo }
    return Persona.create(data);
  },

  async update(legajo, data) {
    const persona = await Persona.findByPk(legajo);
    if (!persona) return null;
    await persona.update(data);
    return persona;
  },

  async remove(legajo) {
    const persona = await Persona.findByPk(legajo);
    if (!persona) return false;
    await persona.destroy();
    return true;
  },
};

export default PersonaService;

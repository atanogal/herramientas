import Estado from "../models/Estado.js"; // Ajusta la ruta según tu estructura

const EstadoService = {
  async getAll() {
    return await Estado.findAll();
  },

  async getById(nroEstado) {
    return await Estado.findByPk(nroEstado);
  },

  async create(data) {
    return await Estado.create(data);
  },

  async update(nroEstado, data) {
    const estado = await Estado.findByPk(nroEstado);
    if (!estado) return null;
    return await estado.update(data);
  }
};

export default EstadoService;

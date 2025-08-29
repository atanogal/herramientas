import TipoHerramienta from "../models/TipoHerramienta.js"; // Ajusta la ruta según tu estructura

const TipoHerramientaService = {
  async getAll() {
    return await TipoHerramienta.findAll();
  },

  async getById(nroTipoHerramienta) {
    return await TipoHerramienta.findByPk(nroTipoHerramienta);
  },

  async create(data) {
    return await TipoHerramienta.create(data);
  },

  async update(nroTipoHerramienta, data) {
    const tipo = await TipoHerramienta.findByPk(nroTipoHerramienta);
    if (!tipo) return null;
    return await tipo.update(data);
  },

  async delete(nroTipoHerramienta) {
    const tipo = await TipoHerramienta.findByPk(nroTipoHerramienta);
    if (!tipo) return null;
    await tipo.destroy();
    return tipo;
  }
};

export default TipoHerramientaService;

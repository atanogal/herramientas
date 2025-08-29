import DetallePedido from "../models/DetallePedido.js";

const DetallePedidoService = {
  async getAll() {
    return await DetallePedido.findAll();
  },

  async getById(nroPedido, nroHerramienta) {
    return await DetallePedido.findOne({
      where: { nroPedido, nroHerramienta }
    });
  },

  async getByDetalleId(id) {
    return await DetallePedido.findByPk(id);
  },

  async create(data) {
    return await DetallePedido.create(data);
  },

  async update(nroPedido, nroHerramienta, data) {
    const detalle = await DetallePedido.findOne({
      where: { nroPedido, nroHerramienta }
    });
    if (!detalle) return null;
    return await detalle.update(data);
  },

  async updateEstado(idDetalle, nroEstado) {
    const detalle = await DetallePedido.findByPk(idDetalle);
    if (!detalle) return null;
    detalle.nroEstado = nroEstado;
    return await detalle.save();
  }
};

export default DetallePedidoService;

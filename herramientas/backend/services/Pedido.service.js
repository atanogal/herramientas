import Pedido from "../models/Pedido.js"; // ajusta la ruta según tu estructura
import DetallePedido from "../models/DetallePedido.js"; // importa el modelo de detalles
import Herramienta from "../models/Herramienta.js";

const PedidoService = {
  async getAll() {
    const pedidos = await Pedido.findAll({
    include: [
    {
      model: DetallePedido,
      include: [
        {
          model: Herramienta,
          attributes: ['nroHerramienta', 'nombre', 'nroTipoHerramienta', 'nroEstado']
        }
      ]
    }
    ]
  });
  return pedidos
  },

  async getById(nroPedido) {
    return await Pedido.findByPk(nroPedido, {
      include: [{ model: DetallePedido }] // si querés traer detalles juntos
    });
  },

  async create(data) {
    return await Pedido.create(data);
  },

  async update(nroPedido, data) {
    const pedido = await Pedido.findByPk(nroPedido);
    if (!pedido) return null;
    return await pedido.update(data);
  },

  // Nuevo: crea solo pedido principal
  async createMain(data) {
    const nuevoPedido = await Pedido.create(data);
    return nuevoPedido;
  },

async getDetallesPorPedido(nroPedido) {
  return await DetallePedido.findAll({
    where: { nroPedido },
    include: [{ model: Herramienta }],
  });
  },


async addDetalles(nroPedido, detalles) {
  const pedido = await Pedido.findByPk(nroPedido);
  if (!pedido) {
    throw new Error(`Pedido ${nroPedido} no encontrado`);
  }

  const detallesCreados = await Promise.all(
    detalles.map(async (detalle) => {
      // Crear el detalle con mismo estado que el pedido
      const nuevoDetalle = await DetallePedido.create({
        ...detalle,
        nroPedido,
        nroEstado: pedido.nroEstado,
      });

      // Actualizar estado de la herramienta a "asignada" (2)
      const herramienta = await Herramienta.findByPk(detalle.nroHerramienta);
      if (herramienta) {
        await herramienta.update({ nroEstado: 2 }); // 2 = asignada
      }

      return nuevoDetalle;
    })
  );

  return detallesCreados;
},
async updateDetalleEstado(nroDetalle, nuevoEstado) {
    const detalle = await DetallePedido.findByPk(nroDetalle);
    if (!detalle) throw new Error("Detalle no encontrado");

    // Actualizar el estado del detalle
    await detalle.update({ nroEstado: nuevoEstado });

    // Obtener todos los detalles del pedido para recalcular estado
    const detalles = await DetallePedido.findAll({
      where: { nroPedido: detalle.nroPedido },
    });

    // Lógica para estado del pedido
    const totalDetalles = detalles.length;
    const entregados = detalles.filter((d) => d.nroEstado === 6).length;
    const ahora = new Date();

    const pedido = await Pedido.findByPk(detalle.nroPedido);

    if (entregados === totalDetalles) {
      await pedido.update({ nroEstado: 6 }); // Entregado
    } else if (entregados === 0) {
      // Ninguno entregado
      const plazo = new Date(pedido.fechaPlazo);
      if (ahora > plazo) {
        await pedido.update({ nroEstado: 8 }); // Demorado
      } else {
        await pedido.update({ nroEstado: 5 }); // PteEntrega
      }
    } else {
      // Algunos entregados, otros no
      await pedido.update({ nroEstado: 7 }); // FaltanteEntrega
    }

    return detalle;
  },
    async actualizarEstadoSegunDetalles(nroPedido) {
    const pedido = await Pedido.findByPk(nroPedido);
    if (!pedido) throw new Error("Pedido no encontrado");

    const detalles = await DetallePedido.findAll({ where: { nroPedido } });

    if (detalles.length === 0) {
      // No hay detalles: mantener estado actual o PteEntrega
      return;
    }

    const estadosDetalles = detalles.map((d) => d.nroEstado);
    const todosEntregados = estadosDetalles.every((e) => e === 6);
    const algunoEntregado = estadosDetalles.some((e) => e === 6);

    const hoy = new Date();
    const fechaPlazo = pedido.fechaPlazo ? new Date(pedido.fechaPlazo) : null;

    let nuevoEstadoPedido;

    if (todosEntregados) {
      nuevoEstadoPedido = 6; // Entregado
      // Opcional: set fechaFin = hoy si querés registrar fin
      if (!pedido.fechaFin) {
        pedido.fechaFin = hoy;
      }
    } else if (algunoEntregado) {
      nuevoEstadoPedido = 7; // FaltanteEntrega
    } else {
      // Ningún detalle entregado
      if (fechaPlazo && hoy > fechaPlazo) {
        nuevoEstadoPedido = 8; // Demorado
      } else {
        nuevoEstadoPedido = 5; // PteEntrega
      }
    }

    // Actualizamos el pedido solo si cambia el estado
    if (pedido.nroEstado !== nuevoEstadoPedido) {
      pedido.nroEstado = nuevoEstadoPedido;
      await pedido.save();
    }
  },

};

export default PedidoService;

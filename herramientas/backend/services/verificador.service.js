import Pedido from '../models/Pedido.js';

function soloFecha(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

async function actualizarEstadosSegunFecha() {
  const pedidosPendientes = await Pedido.findAll({
    where: {
      nroEstado: 5, // PteEntrega
    }
  });

  const hoy = soloFecha(new Date());

  for (const pedido of pedidosPendientes) {
    if (pedido.fechaPlazo) {
      const fechaPlazo = soloFecha(new Date(pedido.fechaPlazo));
      if (fechaPlazo <= hoy) {
        await pedido.update({ nroEstado: 8 }); // Demorado
        console.log(`Pedido ${pedido.nroPedido} marcado como Demorado`);
      }
    }
  }
}

export default actualizarEstadosSegunFecha
// services/notificador.service.js
import Pedido from "../models/Pedido.js";

// =============================
// 🔔 Almacenamiento en memoria
// =============================
let notificaciones = [];

function crearNotificacion(mensaje) {
  const notificacion = {
    id: notificaciones.length + 1,
    mensaje,
    fecha: new Date(),
    leido: false,
  };
  notificaciones.push(notificacion);
  return notificacion;
}

function listarNotificaciones() {
  return notificaciones;
}

function marcarComoLeida(id) {
  const notificacion = notificaciones.find(n => n.id === parseInt(id));
  if (!notificacion) return null;
  notificacion.leido = true;
  return notificacion;
}

// =============================
// 📦 Lógica de pedidos
// =============================
function soloFecha(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function diasRestantes(fechaPlazo) {
  const hoy = soloFecha(new Date());
  const plazo = soloFecha(new Date(fechaPlazo));
  const diffTime = plazo - hoy;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

async function verificarPedidos() {
  const pedidos = await Pedido.findAll();

  for (const pedido of pedidos) {
    // Caso 1: pedidos demorados
    if (pedido.nroEstado === 8) {
      crearNotificacion(
        `El pedido ${pedido.nroPedido} ya está en estado Demorado.`
      );
    }

    // Caso 2: próximos a vencer en <= 3 días
    if (pedido.nroEstado === 5 && pedido.fechaPlazo) {
      const dias = diasRestantes(pedido.fechaPlazo);
      if (dias <= 3 && dias >= 0) {
        crearNotificacion(
          `El pedido ${pedido.nroPedido} vence en ${dias} día(s).`
        );
      }
    }
  }
}

// =============================
// 🚀 Exportar funciones
// =============================
export default {
  crearNotificacion,
  listarNotificaciones,
  marcarComoLeida,
  verificarPedidos,
};

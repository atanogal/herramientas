import axios from "axios";

const API_BASE = "http://localhost:4000/detalle";

const detallePedidoService = {
  // Obtener todos los detalles
  getAll: async () => {
    const res = await axios.get(API_BASE);
    return res.data;
  },

  // Obtener un detalle por su ID (ojo que en backend es /:id, pero no está claro si es nroPedido o nroDetalle)
  getById: async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  },

  // Actualizar solo el estado del detalle de pedido
  updateEstado: async (id, nuevoEstado) => {
    // Supongo que "nuevoEstado" es un objeto { nroEstado: X }
    const res = await axios.patch(`${API_BASE}/${id}/estado`, nuevoEstado);
    return res.data;
  },
};

export default detallePedidoService;

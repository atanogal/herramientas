import axios from "axios";

const API_BASE = "http://localhost:4000/pedidos";

const pedidoService = {
  getAll: async () => {
    const res = await axios.get(API_BASE);
    return res.data;
  },

  getById: async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`); // espera ID real
    return res.data;
  },

  getDetalles: async (pedidoId) => {
    const res = await axios.get(`${API_BASE}/${pedidoId}/detalles`);
    return res.data;
  },

  createMain: async (pedidoData) => {
    const res = await axios.post(`${API_BASE}/main`, pedidoData);
    return res.data;
  },

  addDetalles: async (id, detalles) => {
    const res = await axios.post(`${API_BASE}/${id}/detalles`, { detalles });
    return res.data;
  },

  create: async (pedidoData) => {
    const res = await axios.post(API_BASE, pedidoData);
    return res.data;
  },

  update: async (id, pedidoData) => {
    const res = await axios.put(`${API_BASE}/${id}`, pedidoData);
    return res.data;
  },

  actualizarEstadoDetalle: async (idDetalle, nroEstado) => {
    const res = await axios.patch(`${API_BASE}/detalle/${idDetalle}/estado`, { nroEstado });
    return res.data;
  },
};

export default pedidoService;

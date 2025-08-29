// src/services/notificacion.service.js
import axios from "axios";

const API_URL = "http://localhost:4000/notificaciones";

async function getAll() {
  const res = await axios.get(API_URL);
  return res.data;
}

async function marcarComoLeida(id) {
  const res = await axios.put(`${API_URL}/${id}/leida`);
  return res.data;
}

export default {
  getAll,
  marcarComoLeida,
};

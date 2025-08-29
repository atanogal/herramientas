import axios from "axios";

const API_URL = "http://localhost:4000/mail"; // ajustar según tu backend

async function enviarMailPedido(payload) {
  const res = await axios.post(`${API_URL}/pedido`, payload);
  return res.data;
}

export default {
  enviarMailPedido,
};
import axios from "axios";
const API_URL = "http://localhost:4000/detalle-bolsos";

const detalleBolsoService = {
  getByBolso: async (nroBolso) => {
    // Ojo: la ruta tiene /bolso/:nroBolso
    const res = await axios.get(`${API_URL}/bolso/${nroBolso}`);
    return res.data;
  },

  create: async ({ nroBolso, nroHerramienta }) => {
    const res = await axios.post(API_URL, { nroBolso, nroHerramienta });
    return res.data;
  },

  remove: async (nroBolso, nroHerramienta) => {
    const res = await axios.delete(`${API_URL}/${nroBolso}/${nroHerramienta}`);
    return res.data;
  },
};

export default detalleBolsoService;

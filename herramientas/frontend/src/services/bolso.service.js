import axios from "axios";
const API_URL = "http://localhost:4000/bolsos";

const bolsoService = {
  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data;
  },
  getById: async (nroBolso) => {
    const res = await axios.get(`${API_URL}/${nroBolso}`);
    return res.data;
  },
  create: async ({ legajo }) => {
    const res = await axios.post(API_URL, { legajo });
    return res.data;
  },
  update: async (nroBolso, payload) => {
    const res = await axios.put(`${API_URL}/${nroBolso}`, payload);
    return res.data;
  },
  remove: async (nroBolso) => {
    const res = await axios.delete(`${API_URL}/${nroBolso}`);
    return res.data;
  },
};

export default bolsoService;

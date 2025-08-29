import axios from "axios";
const API_BASE = "http://localhost:4000/personas";

const personaService = {
  getAll: async () => {
    const { data } = await axios.get(API_BASE);
    return data; // [{legajo, nombre, correo}, ...]
  },
};

export default personaService;
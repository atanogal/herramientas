import axios from "axios";

const API_BASE = "http://localhost:4000/estado";

const estadoService = {
  getAll: async () => {
    const res = await axios.get(API_BASE);
    return res.data;
  },
};

export default estadoService;
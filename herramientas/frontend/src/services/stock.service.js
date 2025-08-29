    import axios from "axios";

    const API_URL = "http://localhost:4000/stock";

    const stockService = {
      getResumenCantidadPorTipo: async () => {
        const response = await axios.get(`${API_URL}/cantidadPorTipo`);
        return response.data;
      },
      getHerramientas: async () => {
        // Asegúrate de incluir las relaciones si necesitas ver los detalles completos en una lista de herramientas
        const response = await axios.get(`${API_URL}/herramientas`);
        return response.data;
      },
      getHerramienta: async(id)=>{
       const response = await axios.get(`${API_URL}/herramientas/${id}`);
        return response.data;
      },
      getHerramientasPorTipoEstado: async (nroTipo, estadoNombre) => {
  const res = await axios.get(`${API_URL}/herramientas/filtros`, {
        params: { nroTipoHerramienta: nroTipo, estado: estadoNombre },
      });
        return res.data;
      },
        getTiposHerramienta: async () => {
        const res = await axios.get(`http://localhost:4000/tipoHerramienta`);
        return res.data; // [{nroTipoHerramienta, nombre}, ...]
      },
      actualizarEstado: async (nroHerramienta, nroEstado) => {
    const res = await axios.put(`${API_URL}/herramientas/${nroHerramienta}`, {
      nroEstado,
    });
    return res.data;
  },  
    
    };

    export default stockService;
    
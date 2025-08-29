import stockService from '../services/Stock.service.js';
import '../models/relaciones.js';
import Estado from '../models/Estado.js';       // <-- importar modelo Estado
import Herramienta from '../models/Herramienta.js'; 


const getHerramientas = async (req, res) => {
  try {
    const herramientas = await stockService.getHerramientas(req.query);
    res.json(herramientas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHerramienta = async (req, res) => {
  try {
    const herramienta = await stockService.getHerramienta(req.params.id);
    if (!herramienta) return res.status(404).json({ error: 'Herramienta no encontrada' });
    res.json(herramienta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const crearHerramienta = async (req, res) => {
  try {
    const nueva = await stockService.crearHerramienta(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateHerramienta = async (req, res) => {
  try {
    const actualizada = await stockService.updateHerramienta(req.params.id, req.body);
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteHerramienta = async (req, res) => {
  try {
    await stockService.deleteHerramienta(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getCantidadPorTipo = async (req, res) => {
  try {
    const resultado = await stockService.getCantidadPorTipoHerramienta();
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHerramientasFiltradas = async(req, res) => {
    try {
      const { nroTipoHerramienta, estado } = req.query;

      if (!nroTipoHerramienta || !estado) {
        return res.status(400).json({ message: "Faltan parámetros" });
      }

      // Encontrar nroEstado según nombre (ejemplo "PteAsignar")
      const estadoObj = await Estado.findOne({ where: { nombre: estado } });
      if (!estadoObj) {
        return res.status(404).json({ message: "Estado no encontrado" });
      }

      const herramientas = await Herramienta.findAll({
        where: {
          nroTipoHerramienta,
          nroEstado: estadoObj.nroEstado,
        },
      });

      res.json(herramientas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

export default {
  getHerramientas,
  getHerramienta,
  crearHerramienta,
  updateHerramienta,
  deleteHerramienta,
  getCantidadPorTipo,
  getHerramientasFiltradas
};

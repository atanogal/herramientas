import { Op, Sequelize } from "sequelize";
import Herramienta from "../models/Herramienta.js";
import TipoHerramienta from "../models/TipoHerramienta.js";
import Estado from "../models/Estado.js";
import sequelize from "../db.js";

// Obtener herramienta por id con relaciones
const getHerramienta = async (id) => {
  try {
    const herramienta = await Herramienta.findByPk(id, {
      include: [
        { model: TipoHerramienta, as: 'TipoHerramientum', attributes: ['nombre', 'nroTipoHerramienta'] },
        { model: Estado, as: 'Estado', attributes: ['nombre'] }
      ]
    });
    if (!herramienta) throw new Error('Herramienta no encontrada');
    return herramienta;
  } catch (error) {
    throw error;
  }
};

// Obtener herramientas con filtros y orden
const getHerramientas = async (query) => {
  try {
    const { orden, nombre, tipoHerramienta, estado } = query || {};

    const campoOrden = orden || 'nombre';
    const expOrden = [[campoOrden, 'ASC']];
    const filtroNombre = `%${nombre || ''}%`;

    const where = {
      nombre: { [Op.like]: filtroNombre }
    };

    if (tipoHerramienta) {
      where.nroTipoHerramienta = tipoHerramienta;
    }

    if (estado) {
      where.nroEstado = estado;
    }

    const herramientas = await Herramienta.findAll({
      where,
      order: expOrden,
      include: [
        { model: TipoHerramienta, as: 'TipoHerramientum', attributes: ['nombre', 'nroTipoHerramienta'] },
        { model: Estado, as: 'Estado', attributes: ['nombre'] }
      ],
      raw: true
    });

    return herramientas;
  } catch (error) {
    throw error;
  }
};

// Crear herramienta nueva
const crearHerramienta = async (datosHerramienta) => {
  try {
    const estado = await Estado.findByPk(datosHerramienta.nroEstado);
    const tipo = await TipoHerramienta.findByPk(datosHerramienta.nroTipoHerramienta);

    if (!estado) throw new Error('Estado no encontrado');
    if (!tipo) throw new Error('Tipo de herramienta no encontrado');

    const herramienta = await Herramienta.create(datosHerramienta);
    return herramienta;
  } catch (error) {
    throw error;
  }
};

// Actualizar herramienta
const updateHerramienta = async (id, datosHerramienta) => {
  try {
    const herramienta = await Herramienta.findByPk(id);
    if (!herramienta) throw new Error('Herramienta no encontrada');

    if (datosHerramienta.nroEstado) {
      const estado = await Estado.findByPk(datosHerramienta.nroEstado);
      if (!estado) throw new Error('Estado no válido');
    }

    if (datosHerramienta.nroTipoHerramienta) {
      const tipo = await TipoHerramienta.findByPk(datosHerramienta.nroTipoHerramienta);
      if (!tipo) throw new Error('Tipo de herramienta no válido');
    }

    Object.keys(datosHerramienta).forEach((key) => {
      if (datosHerramienta[key] !== undefined) {
        herramienta[key] = datosHerramienta[key];
      }
    });

    await herramienta.save();
    return herramienta;
  } catch (error) {
    throw error;
  }
};

// Eliminar herramienta
const deleteHerramienta = async (id) => {
  try {
    const herramienta = await Herramienta.findByPk(id);
    if (!herramienta) throw new Error('Herramienta no encontrada');
    await herramienta.destroy();
  } catch (error) {
    throw error;
  }
};

// Obtener cantidad de herramientas por tipo y estado
const getCantidadPorTipoHerramienta = async () => {
  try {
    const resultados = await Herramienta.findAll({
      attributes: [
        [Sequelize.col('TipoHerramientum.nombre'), 'tipo'],
        [Sequelize.col('Estado.nombre'), 'estado'],
        [Sequelize.fn('COUNT', Sequelize.col('Herramienta.nroHerramienta')), 'cantidad']
      ],
      include: [
        { model: TipoHerramienta, as: 'TipoHerramientum', attributes: [] },
        { model: Estado, as: 'Estado', attributes: [], where: { ambito: 'Herramienta' } }
      ],
      group: ['TipoHerramientum.nombre', 'Estado.nombre'],
      raw: true
    });

    const map = {};
    resultados.forEach(r => {
      const tipo = r.tipo;
      const estado = r.estado;
      const cantidad = parseInt(r.cantidad);

      if (!map[tipo]) {
        map[tipo] = { tipo, resumen: { total: 0 } };
      }

      map[tipo].resumen[estado] = cantidad;
      map[tipo].resumen.total += cantidad;
    });

    return Object.values(map);
  } catch (error) {
    throw error;
  }
};

// Función para obtener herramientas filtradas por tipo y estado (para el endpoint)
const getHerramientasFiltradas = async (req, res) => {
  try {
    const { nroTipoHerramienta, estado } = req.query;

    if (!nroTipoHerramienta || !estado) {
      return res.status(400).json({ message: "Faltan parámetros" });
    }

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
  getHerramienta,
  getHerramientas,
  crearHerramienta,
  updateHerramienta,
  deleteHerramienta,
  getCantidadPorTipoHerramienta,
  getHerramientasFiltradas
};

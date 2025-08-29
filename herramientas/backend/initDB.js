// initDB.js
import sequelize from './db.js';

import './models/Pedido.js';
import './models/DetallePedido.js';
import './models/Herramienta.js';
import './models/TipoHerramienta.js';
import './models/Estado.js';
import './models/relaciones.js'; // importante para registrar asociaciones

import Estado from './models/Estado.js';
import TipoHerramienta from './models/TipoHerramienta.js';

export async function initDatabase() {
  try {
    //await sequelize.sync({ force: true });
    //cargarDatosIniciales()
    console.log("✅ Base de datos inicializada con datos.");
  } catch (error) {
    console.error("❌ Error al inicializar la base de datos:", error);
  }
}

async function cargarDatosIniciales() {
  // Estados
  const estados = [
    { numero: 1, nombre: 'PteAsignar', ambito: 'Herramienta' },
    { numero: 2, nombre: 'Asignada', ambito: 'Herramienta' },
    { numero: 3, nombre: 'PteReparacion', ambito: 'Herramienta' },
    { numero: 4, nombre: 'Baja', ambito: 'Herramienta' },
    { numero: 5, nombre: 'PteEntrega', ambito: 'Pedido' },
    { numero: 6, nombre: 'Entregado', ambito: 'Pedido' },
    { numero: 7, nombre: 'FaltanteEntrega', ambito: 'Pedido' },
    { numero: 8, nombre: 'Demorado', ambito: 'Pedido' },
    { numero: 9, nombre: 'EnBolso', ambito: 'Herramienta' }
  ];

  await Estado.bulkCreate(estados);

   const nombresTipos = [
    'Alicate',
    'Arco de sierra',
    'Busca Polo digital',
    'Cinta Pasacable',
    'Crimpeadora',
    'Destornillador',
    'Escalera',
    'Mecha Copa p/madera',
    'Mecha Copa p/pared',
    'Mechas de Acero Rapido',
    'Mechas de widia',
    'Nivel',
    'Pela Cable',
    'Pinza Amperometrica',
    'Pinza de comun',
    'Pinza de punta',
    'Pinza Perro',
    'Pistola para barra de silicona',
    'Pistola para pegado en caliente',
    'Serrucho',
    'Set de puntas',
    'Soldadora para estaño',
    'Tester',
    'Tester de Red',
    'Amoladora',
    'Atornillador manual',
    'Taladro electrico',
    'Taladro Atornillador inalambrico',
    'Prolongador Multiple',
    'Mochila Dell',
    'Aire Comprimido',
    'Mochila Lusqtoff',
    'Puntero Genius',
    'Llave de Tubos'
  ];

  const tipos = nombresTipos.map(nombre => ({ nombre }));
  await TipoHerramienta.bulkCreate(tipos, { ignoreDuplicates: true });
}

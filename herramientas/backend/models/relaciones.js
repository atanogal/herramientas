// models/relaciones.js
import Pedido from './Pedido.js';
import Herramienta from './Herramienta.js';
import DetallePedido from './DetallePedido.js';
import Estado from './Estado.js';
import TipoHerramienta from './TipoHerramienta.js';
import Persona from './Persona.js';
import Bolso from './Bolso.js';
import DetalleBolso from './DetalleBolso.js';

// Pedido -> DetallePedido
Pedido.hasMany(DetallePedido, {
  foreignKey: 'nroPedido',
  onDelete: 'CASCADE',
});
DetallePedido.belongsTo(Pedido, {
  foreignKey: 'nroPedido',
});

// Herramienta -> DetallePedido
Herramienta.hasMany(DetallePedido, {
  foreignKey: 'nroHerramienta',
  onDelete: 'SET NULL',
});
DetallePedido.belongsTo(Herramienta, {
  foreignKey: 'nroHerramienta',
});

// Estado -> Pedido
Estado.hasMany(Pedido, {
  foreignKey: 'nroEstado',
  onDelete: 'RESTRICT',
});
Pedido.belongsTo(Estado, {
  foreignKey: 'nroEstado',
});

// Estado -> Herramienta
Estado.hasMany(Herramienta, {
  foreignKey: 'nroEstado',
  onDelete: 'RESTRICT',
});
Herramienta.belongsTo(Estado, {
  foreignKey: 'nroEstado',
});

// TipoHerramienta -> Herramienta
TipoHerramienta.hasMany(Herramienta, {
  foreignKey: 'nroTipoHerramienta',
  onDelete: 'RESTRICT',
});
Herramienta.belongsTo(TipoHerramienta, {
  foreignKey: 'nroTipoHerramienta',
});

Estado.hasMany(DetallePedido, {
  foreignKey: 'nroEstado',
  onDelete: 'RESTRICT'
});
DetallePedido.belongsTo(Estado, {
  foreignKey: 'nroEstado'
});

// Persona -> Bolso
Persona.hasMany(Bolso, {
  foreignKey: 'legajo',
  onDelete: 'CASCADE',
});
Bolso.belongsTo(Persona, {
  foreignKey: 'legajo',
});

// Bolso -> DetalleBolso
Bolso.hasMany(DetalleBolso, {
  foreignKey: 'nroBolso',
  onDelete: 'CASCADE',
});
DetalleBolso.belongsTo(Bolso, {
  foreignKey: 'nroBolso',
});

// Herramienta -> DetalleBolso
Herramienta.hasMany(DetalleBolso, {
  foreignKey: 'nroHerramienta',
  onDelete: 'RESTRICT',
});
DetalleBolso.belongsTo(Herramienta, {
  foreignKey: 'nroHerramienta',
});

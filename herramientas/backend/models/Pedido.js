import { DataTypes } from "sequelize";
import sequelize from "../db.js"; // Asegúrate de que esta ruta sea correcta para tu instancia de Sequelize

const Pedido = sequelize.define('Pedido', {
  nroPedido: {
    type: DataTypes.INTEGER,
    primaryKey: true, // ¡CRÍTICO! Debe ser la clave primaria
    autoIncrement: true, // ¡CRÍTICO! Debe ser autoincremental
    allowNull: false
  },
  fechaInicio: {
    type: DataTypes.DATEONLY, // O DataTypes.DATE si incluyes hora
    allowNull: false,
  },
  fechaPlazo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  fechaFin: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Puede ser null si el pedido aún no ha finalizado
  },
  persona: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ubicacion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nroEstado: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  // Opciones del modelo
  tableName: 'Pedidos', // Asegúrate de que este sea el nombre real de tu tabla en la DB
  timestamps: true, // Si usas `createdAt` y `updatedAt`

});

export default Pedido;

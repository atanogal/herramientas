import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const DetallePedido = sequelize.define('DetallePedido', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nroPedido: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nroHerramienta: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nroEstado: {
    type: DataTypes.INTEGER,
    allowNull: false 
  }
});

export default DetallePedido;
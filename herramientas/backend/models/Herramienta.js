import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Herramienta = sequelize.define('Herramienta', {
    nroHerramienta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nroTipoHerramienta: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nroEstado:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

export default Herramienta
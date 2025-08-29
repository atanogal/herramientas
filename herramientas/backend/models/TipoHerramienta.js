// models/TipoHerramienta.js
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const TipoHerramienta = sequelize.define('TipoHerramienta', {
    nroTipoHerramienta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        unique: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    timestamps: false // 👈 Sin createdAt ni updatedAt
});

export default TipoHerramienta;

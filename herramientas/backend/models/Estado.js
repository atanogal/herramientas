import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Estado = sequelize.define('Estado', {
    nroEstado: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ambito: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Estado
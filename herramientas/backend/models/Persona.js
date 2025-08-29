import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Persona = sequelize.define("Persona", {
    legajo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    nombre:{
        type: DataTypes.STRING,
        allowNull: false
    },
    correo: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

export default Persona;
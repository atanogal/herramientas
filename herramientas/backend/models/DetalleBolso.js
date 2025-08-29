import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const DetalleBolso = sequelize.define("DetalleBolso", {
    nroBolso:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nroHerramienta:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

export default DetalleBolso
import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Bolso = sequelize.define("Bolso", {
    nroBolso:{
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    legajo:{
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false
});

export default Bolso
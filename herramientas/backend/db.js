import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DB_PATH || "./SQL/db.sqlite" // corregido aquí
});

export default sequelize;

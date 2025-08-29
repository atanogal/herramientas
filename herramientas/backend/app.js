import express from 'express';
import stockRouter from "./routes/Stock.routes.js"
import pedidoRouter from "./routes/Pedido.routes.js"
import detalleRouter from "./routes/DetallePedido.routes.js"
import EstadoRouter from "./routes/estado.routes.js";
import TipoHerramientaRouter from "./routes/TipoHerramienta.routes.js";
import cors from "cors";
import sequelize from './db.js';
import actualizarEstadosSegunFecha from './services/verificador.service.js';
import personasRoutes from "./routes/Persona.routes.js"
import bolsoRoutes from "./routes/Bolso.routes.js"
import detalleBolsoRoutes from "./routes/DetalleBolso.routes.js"
import notificacionRoutes from "./routes/Notificaciones.routes.js"
import NotificacionesService from './services/Notificaciones.service.js';
import mailRoutes from "./routes/Mail.routes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.use("/tipoHerramienta", TipoHerramientaRouter)
app.use("/estado", EstadoRouter);
app.use("/stock",stockRouter)
app.use("/pedidos", pedidoRouter)
app.use("/detalle", detalleRouter)
app.use("/personas", personasRoutes);
app.use("/bolsos", bolsoRoutes);
app.use("/detalle-bolsos", detalleBolsoRoutes);
app.use("/notificaciones", notificacionRoutes);
app.use("/mail", mailRoutes);

sequelize.sync().then(async () => {
  await actualizarEstadosSegunFecha();
  await NotificacionesService.verificarPedidos();
});

export default app;
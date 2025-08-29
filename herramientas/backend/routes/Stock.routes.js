import { Router } from 'express';
import stockController from '../controllers/stock.controller.js';

const router = Router();

router.get('/herramientas/filtros', stockController.getHerramientasFiltradas);
router.get('/herramientas', stockController.getHerramientas);
router.get('/herramientas/:id', stockController.getHerramienta);
router.post('/herramientas', stockController.crearHerramienta);
router.put('/herramientas/:id', stockController.updateHerramienta);
router.delete('/herramientas/:id', stockController.deleteHerramienta);
router.get('/cantidadPorTipo', stockController.getCantidadPorTipo);

export default router;

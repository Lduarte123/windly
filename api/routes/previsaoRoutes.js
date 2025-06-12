// routes/weatherRoutes.js
import { Router } from 'express';
import PrevisaoController from '../controllers/previsaoController.js';

const router = Router();

router.get('/:cidade', PrevisaoController.getWeather);

export default router;

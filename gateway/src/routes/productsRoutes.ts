import { Router } from 'express';
import productsProxy from '../proxy/productsProxy';

const router = Router();

// Todas las rutas de /products se proxyfican hacia products service
router.use('/', productsProxy);

export default router;

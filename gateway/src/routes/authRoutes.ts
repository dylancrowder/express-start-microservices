import { Router } from 'express';
import authProxy from '../proxy/authProxy';

const router = Router();

// Todas las rutas de /auth se proxyfican hacia auth service (login, register, etc)
router.use('/', authProxy);

export default router;

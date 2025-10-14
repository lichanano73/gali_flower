import express from 'express';

import { loginClient } from '../../controllers/api/auth.client';
//import { verifyTokenClient } from '../middlewares/verifyToken';

const router = express.Router();

router.use('/auth', loginClient);

export default router;
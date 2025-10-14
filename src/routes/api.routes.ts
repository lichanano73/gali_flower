import express from 'express';

import authRouter from './auth.routes';
import projectsRouter from './projects.routes';

import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/projects', verifyToken , projectsRouter);

export default router;
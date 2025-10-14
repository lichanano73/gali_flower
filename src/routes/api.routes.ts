import express from 'express';
import * as authController from '../controllers/auth.controller';
import projectsRouter from './projects.routes';
import membersRouter from './members.routes';

import { verifyToken } from '../middlewares/verifyToken';

const router = express.Router();

router.use('/auth', authController.login);
router.use('/projects', verifyToken , projectsRouter);
router.use('/members',  verifyToken , membersRouter);

export default router;
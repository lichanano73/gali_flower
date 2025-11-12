import express from 'express';
import * as authController from '../controllers/auth.controller';
import projectsRouter from './projects.routes';
import membersRouter from './members.routes';

import { verifyTokenAdminGali } from '../middlewares/verifyToken';

const router = express.Router();

router.use('/auth', authController.login);
router.use('/projects', verifyTokenAdminGali , projectsRouter);
router.use('/members',  verifyTokenAdminGali , membersRouter);

export default router;
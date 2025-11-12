import express from 'express';

import { loginClient } from '../../controllers/api/auth.client';
import { verifyTokenGali } from '../../middlewares/verifyToken';
import * as userClient from '../../controllers/api/users.client';

const router = express.Router();

router.use('/auth', loginClient);   // client 1.1     
router.put('/users/:id', verifyTokenGali, userClient.clientUpdateUser); // client 1.2

export default router;
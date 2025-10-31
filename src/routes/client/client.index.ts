import express from 'express';

import { loginClient } from '../../controllers/api/auth.client';
//import { verifyTokenClient } from '../middlewares/verifyToken';
import * as userClient from '../../controllers/api/users.client';

const router = express.Router();

router.use('/auth', loginClient);


router.put('/users/:id', /*verifyTokenClient,*/ userClient.clientUpdateUser);

export default router;
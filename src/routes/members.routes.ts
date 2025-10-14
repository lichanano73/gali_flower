import express from 'express';
import * as memberCtrl from '../controllers/members.controller';

const router = express.Router();

router.get('/',     memberCtrl.getUsers);            // 3.1 List
router.post('/',    memberCtrl.createUser);          // 3.2 Create 

/* 
router.put('/:id',          memberCtrl.updateProject);          // 2.4
router.delete('/:id',       memberCtrl.deleteProject);          // 2.5
router.post('/:id/members', memberCtrl.addMemberToProject);     // 2.6
*/


export default router;
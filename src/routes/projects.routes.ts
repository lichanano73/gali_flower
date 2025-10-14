import express from 'express';

import * as prjCtrl from '../controllers/projects.controller';

const router = express.Router();

router.get('/',             prjCtrl.getAllProjects);         // 2.1
router.get('/:id',          prjCtrl.getProjectById);         // 2.2
router.post('/',            prjCtrl.createProject);          // 2.3
router.put('/:id',          prjCtrl.updateProject);          // 2.4
router.delete('/:id',       prjCtrl.deleteProject);          // 2.5
router.post('/:id/members', prjCtrl.addMemberToProject);     // 2.6

export default router;
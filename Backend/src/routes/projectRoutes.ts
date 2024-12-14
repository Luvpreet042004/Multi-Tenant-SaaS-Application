import express from 'express';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { createProject,deleteProject,editProject, getProject } from '../controllers/projectController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post ('/create',verifyAdmin,createProject)//working
router.put ('/edit/:projectId',verifyAdmin,editProject)// working
router.delete ('/delete/:projectId',verifyAdmin,deleteProject)//working
router.get('/getProject/:id',authMiddleware,getProject)// working


export default router;
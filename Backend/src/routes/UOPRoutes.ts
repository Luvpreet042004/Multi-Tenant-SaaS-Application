import express from 'express';
import { addUsersToProject,deleteUserFromProject,getUsersOnProject } from '../controllers/UOPController';
import { verifyAdmin } from '../middlewares/verifyAdmin';


const router = express.Router();


router.post('/addUsersToProject',verifyAdmin,addUsersToProject)//working
router.delete('/delete/p/:projectId/u/:userId',verifyAdmin,deleteUserFromProject)// working
router.get('/getUsersOnProject/:projectId',verifyAdmin,getUsersOnProject)//working

export default router;

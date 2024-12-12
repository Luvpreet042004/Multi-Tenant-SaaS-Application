import express from 'express';
import {loginUser, createUser,changePassword,deleteUser } from '../controllers/userController';
import { validateSchemaMiddleware } from '../middlewares/validateRequestMiddleware';
import { loginUserSchema, registerUserSchema } from '../schemas/userSchemas';
import { changePasswordSchema } from '../schemas/userSchemas';
import authMiddleware from '../middlewares/authMiddleware';
import { verifyAdmin } from '../middlewares/verifyAdmin';


const router = express.Router();

router.post('/loginUser' ,validateSchemaMiddleware(loginUserSchema), loginUser);//working
router.post('/register',validateSchemaMiddleware(registerUserSchema), createUser);// working
router.put("/change-password",validateSchemaMiddleware(changePasswordSchema),authMiddleware,changePassword);
router.delete('/delete',verifyAdmin,deleteUser)

export default router;

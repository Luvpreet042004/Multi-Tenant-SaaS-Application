import express from 'express';
import {loginUser, createUser } from '../controllers/userController';

const router = express.Router();

router.post('/loginUser' , loginUser);
router.post('/register', createUser);

export default router;

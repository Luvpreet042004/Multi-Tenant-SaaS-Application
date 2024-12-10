import express from 'express';
import userRoutes from './userRoutes';
import tenantRoutes from './tenantRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tenant',tenantRoutes);

export default router;
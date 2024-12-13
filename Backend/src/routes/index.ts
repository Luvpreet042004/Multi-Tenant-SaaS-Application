import express from 'express';
import userRoutes from './userRoutes';
import tenantRoutes from './tenantRoutes';
import projectRoutes from './projectRoutes';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/tenant',tenantRoutes);
router.use('/project',projectRoutes);

export default router;
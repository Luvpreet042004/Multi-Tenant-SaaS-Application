import express from 'express';
import { createTenantWithAdmin,getTenantDetails } from '../controllers/tenantController';
import { verifyAdmin } from '../middlewares/verifyAdmin';

const router = express.Router();

router.post('/create', createTenantWithAdmin);

router.get('/:tenantId', verifyAdmin, getTenantDetails);

export default router;

import express from 'express';
import { createTenantWithAdmin,getTenantDetails } from '../controllers/tenantController';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { validateSchemaMiddleware } from '../middlewares/validateRequestMiddleware';
import { tenantSchema } from '../schemas/tenantSchema';

const router = express.Router();

router.post('/create',validateSchemaMiddleware(tenantSchema) ,createTenantWithAdmin); //working

router.get('/:tenantId' ,verifyAdmin, getTenantDetails);//working

export default router;

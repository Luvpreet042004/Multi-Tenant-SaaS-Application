import express from 'express';
import { createTenantWithAdmin,deleteTenant,getTenantDetails,updateTenant } from '../controllers/tenantController';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { validateSchemaMiddleware } from '../middlewares/validateRequestMiddleware';
import { tenantSchema, updateTenantSchema } from '../schemas/tenantSchema';

const router = express.Router();

router.post('/create',validateSchemaMiddleware(tenantSchema) ,createTenantWithAdmin); //working

router.get('/:tenantId' ,verifyAdmin, getTenantDetails);//working
router.put('/update',validateSchemaMiddleware(updateTenantSchema),verifyAdmin, updateTenant);
router.delete('/delete',verifyAdmin,deleteTenant);

export default router;

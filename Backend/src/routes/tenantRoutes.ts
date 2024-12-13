import express from 'express';
import { createTenantWithAdmin,deleteTenant,getTenantDetails,updateTenant } from '../controllers/tenantController';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { validateSchemaMiddleware } from '../middlewares/validateRequestMiddleware';
import { tenantSchema, updateTenantSchema } from '../schemas/tenantSchema';
import { getAllProject } from '../controllers/projectController';

const router = express.Router();

router.post('/create',validateSchemaMiddleware(tenantSchema) ,createTenantWithAdmin); //working

router.get('/:tenantId' ,verifyAdmin, getTenantDetails);//working
router.put('/update',validateSchemaMiddleware(updateTenantSchema),verifyAdmin, updateTenant);//working
router.delete('/delete',verifyAdmin,deleteTenant);// working
// router.get('/allprojects',verifyAdmin,getAllProject)


export default router;

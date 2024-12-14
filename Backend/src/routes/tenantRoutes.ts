import express from 'express';
import { createTenantWithAdmin,deleteTenant,getTenantDetails,updateTenant,getAllProjects } from '../controllers/tenantController';
import { verifyAdmin } from '../middlewares/verifyAdmin';
import { validateSchemaMiddleware } from '../middlewares/validateRequestMiddleware';
import { tenantSchema, updateTenantSchema } from '../schemas/tenantSchema';

const router = express.Router();

router.post('/create',validateSchemaMiddleware(tenantSchema) ,createTenantWithAdmin); //working

router.get('/getallprojects',verifyAdmin,getAllProjects);//working
router.get('/getTenantDetails' ,verifyAdmin, getTenantDetails);//working
router.put('/update',validateSchemaMiddleware(updateTenantSchema),verifyAdmin, updateTenant);//working
router.delete('/delete',verifyAdmin,deleteTenant);// working


export default router;

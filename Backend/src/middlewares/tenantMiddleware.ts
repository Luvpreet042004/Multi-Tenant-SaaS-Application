import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        id: number;
        name: string;
      };
    }
  }
}

const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { tenantId } = req.headers;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant ID is required" });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: parseInt(tenantId as string, 10) },
  });

  if (!tenant) {
    return res.status(404).json({ error: "Tenant not found" });
  }

  req.tenant = tenant; 
  next();
};

export default tenantMiddleware;
;

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        tenantId: number;
        role: string;
      };
    }
  }
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    
    await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default authMiddleware;

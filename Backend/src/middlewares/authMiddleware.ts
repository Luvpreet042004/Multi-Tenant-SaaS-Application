import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

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

const authMiddleware = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization token missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as {userId : number, tenantId : number, role : string};

    req.user = {
      id : decoded.userId,
      tenantId : decoded.tenantId,
      role : decoded.role
    }
    

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};

export default authMiddleware;

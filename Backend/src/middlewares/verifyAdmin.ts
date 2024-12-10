import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  const { tenantId } = req.params;

  if (!token) {
    res.status(403).json({ error: 'No token provided' });
    return;
  }


  try {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
      }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; tenantId: number; role: string };

    if (decoded.role !== 'admin') {
        res.status(403).json({ error: 'Unauthorized access' });
        return;
    }

    if (decoded.tenantId !== Number(tenantId) ){
        res.status(403).json({ error: 'Unauthorized access to tenant details' });
        return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
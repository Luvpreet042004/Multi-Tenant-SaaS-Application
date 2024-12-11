import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const validateSchemaMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction):void => {
    try {
      schema.parse(req.body); 
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        
        res.status(400).json({ error: error.errors });
        return;
      }
      next(error); 
    }
  };
};
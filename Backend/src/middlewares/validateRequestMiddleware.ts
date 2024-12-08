import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

const validateRequestMiddleware = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body); 
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        
        return res.status(400).json({ error: error.errors });
      }
      next(error); 
    }
  };
};

export default validateRequestMiddleware;

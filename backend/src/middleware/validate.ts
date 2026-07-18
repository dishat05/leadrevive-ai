import { NextFunction, Request, Response } from 'express';

export function validate(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (err: any) {
      res.status(400).json({ 
        success: false, 
        error: { message: err.errors?.[0]?.message || err.message } 
      });
    }
  };
}
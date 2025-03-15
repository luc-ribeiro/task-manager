import { Request, Response } from 'express';

export const unknownErrorHandler = (err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
};

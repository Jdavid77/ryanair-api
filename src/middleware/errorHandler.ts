import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    res.status(400).json({
      error: 'Validation Error',
      message: err.message,
    });
    return;
  }

  if (err.message.includes('Invalid IATA code')) {
    res.status(400).json({
      error: 'Invalid IATA Code',
      message: 'Please provide a valid 3-letter IATA airport code',
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message,
  });
};

import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      airports: '/api/airports',
      fares: '/api/fares',
      flights: '/api/flights',
    },
  });
};

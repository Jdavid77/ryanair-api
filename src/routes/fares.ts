import { Router, Request, Response, NextFunction } from 'express';
import { ryanairClient } from '../utils/ryanairClient.js';
import { validateIataParams, validateDateParams, validateRequiredParams, validateDateRange } from '../middleware/validation.js';
import { validatePassengerCount } from '../utils/validation.js';
import { sendValidationError } from '../utils/responseHelpers.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Fares
 *   description: Flight fare search and pricing
 */

/**
 * @swagger
 * /api/fares/cheapest-per-day:
 *   get:
 *     summary: Get cheapest fares per day for a route
 *     tags: [Fares]
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{3}$'
 *         description: Departure airport IATA code
 *         example: DUB
 *       - in: query
 *         name: to
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{3}$'
 *         description: Arrival airport IATA code
 *         example: STN
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date in YYYY-MM-DD format
 *         example: '2024-06-15'
 *       - in: query
 *         name: currency
 *         required: false
 *         schema:
 *           type: string
 *           default: EUR
 *         description: Currency code
 *         example: EUR
 *     responses:
 *       200:
 *         description: Cheapest fares per day
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fare'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/cheapest-per-day', 
  validateRequiredParams(['from', 'to', 'startDate']),
  validateIataParams('from', 'to'),
  validateDateParams('startDate'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { from, to, startDate, currency } = req.query;
      
      const result = await ryanairClient.fares.getCheapestPerDay(
        from as string,
        to as string,
        startDate as string,
        (currency as string) || 'EUR'
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error in /fares/cheapest-per-day:', error);
      next(error);
    }
  }
);

router.get('/daily-range',
  validateRequiredParams(['from', 'to', 'startDate', 'endDate']),
  validateIataParams('from', 'to'),
  validateDateParams('startDate', 'endDate'),
  validateDateRange(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { from, to, startDate, endDate, currency } = req.query;
      
      const result = await ryanairClient.fares.findDailyFaresInRange(
        from as string,
        to as string,
        startDate as string,
        endDate as string,
        (currency as string) || 'EUR'
      );
      
      res.json(result);
    } catch (error) {
      console.error('Error in /fares/daily-range:', error);
      next(error);
    }
  }
);

router.get('/cheapest-round-trip',
  validateRequiredParams(['from', 'to', 'startDate', 'endDate']),
  validateIataParams('from', 'to'),
  validateDateParams('startDate', 'endDate'),
  validateDateRange(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { from, to, startDate, endDate, currency, limit } = req.query;
      
      const limitNum = limit ? parseInt(limit as string) : 10;
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        return sendValidationError(res, 'Limit must be a number between 1 and 100', 'limit');
      }
      
      const roundTrips = await ryanairClient.fares.findCheapestRoundTrip(
        from as string,
        to as string,
        startDate as string,
        endDate as string,
        (currency as string) || 'EUR',
        limitNum
      );
      
      res.json(roundTrips);
    } catch (error) {
      console.error('Error in /fares/cheapest-round-trip:', error);
      next(error);
    }
  }
);

export { router as default };
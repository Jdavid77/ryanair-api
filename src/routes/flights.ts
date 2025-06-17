import { Router, Request, Response, NextFunction } from 'express';
import { ryanairClient } from '../utils/ryanairClient.js';
import {
  validateIataParams,
  validateDateParams,
  validateRequiredParams,
} from '../middleware/validation.js';
import { validatePassengerCount } from '../utils/validation.js';
import { sendValidationError } from '../utils/responseHelpers.js';
import { AvailabilityOptions, AvailabilityResponse } from '../types/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Flights
 *   description: Flight availability and dates
 */

router.get(
  '/dates',
  validateRequiredParams(['from', 'to']),
  validateIataParams('from', 'to'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to } = req.query;

      const dates = await ryanairClient.flights.getDates(from as string, to as string);
      res.json(dates);
    } catch (error) {
      console.error('Error in /flights/dates:', error);
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/flights/available:
 *   get:
 *     summary: Search for available flights
 *     tags: [Flights]
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
 *         name: dateOut
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *         description: Departure date in YYYY-MM-DD format
 *         example: '2024-06-15'
 *       - in: query
 *         name: adults
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 9
 *           default: 1
 *         description: Number of adult passengers
 *       - in: query
 *         name: children
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 0
 *           maximum: 9
 *           default: 0
 *         description: Number of child passengers
 *     responses:
 *       200:
 *         description: Available flight options
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FlightAvailability'
 *       400:
 *         description: Invalid parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/available',
  validateRequiredParams(['from', 'to']),
  validateIataParams('from', 'to'),
  validateDateParams('dateOut', 'dateIn'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { from, to, dateOut, dateIn, adults, children, teens, infants, promoCode } = req.query;

      // Validate passenger counts
      const adultsNum = adults ? parseInt(adults as string) : 1;
      const childrenNum = children ? parseInt(children as string) : 0;
      const teensNum = teens ? parseInt(teens as string) : 0;
      const infantsNum = infants ? parseInt(infants as string) : 0;

      if (!validatePassengerCount(adultsNum, 1, 9)) {
        sendValidationError(res, 'Adults must be a number between 1 and 9', 'adults');
        return;
      }

      if (!validatePassengerCount(childrenNum, 0, 9)) {
        sendValidationError(res, 'Children must be a number between 0 and 9', 'children');
        return;
      }

      if (!validatePassengerCount(teensNum, 0, 9)) {
        sendValidationError(res, 'Teens must be a number between 0 and 9', 'teens');
        return;
      }

      if (!validatePassengerCount(infantsNum, 0, 9)) {
        sendValidationError(res, 'Infants must be a number between 0 and 9', 'infants');
        return;
      }

      const totalPassengers = adultsNum + childrenNum + teensNum + infantsNum;
      if (totalPassengers > 9) {
        sendValidationError(res, 'Total passengers cannot exceed 9');
        return;
      }

      const availabilityOptions: Partial<AvailabilityOptions> = {
        Origin: from as string,
        Destination: to as string,
        ADT: adultsNum.toString(),
        CHD: childrenNum.toString(),
        TEEN: teensNum.toString(),
        INF: infantsNum.toString(),
        DateOut: (dateOut as string) || '',
      };

      if (dateIn) {
        availabilityOptions.DateIn = dateIn as string;
      }

      if (promoCode) {
        availabilityOptions.promoCode = promoCode as string;
      }

      const availability: AvailabilityResponse =
        await ryanairClient.flights.getAvailable(availabilityOptions);
      res.json(availability);
    } catch (error) {
      console.error('Error in /flights/available:', error);
      next(error);
    }
  }
);

export { router as default };

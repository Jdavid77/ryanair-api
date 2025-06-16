import { Router, Request, Response, NextFunction } from 'express';
import { ryanairClient } from '../utils/ryanairClient.js';
import { validateIataParams } from '../middleware/validation.js';
import {
  Airport,
  Destination,
  AirportSummary,
  ClosestAirport,
  AirportShort,
  AirportDetails,
} from '../types/index.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Airports
 *   description: Airport information and operations
 */

/**
 * @swagger
 * /api/airports/active:
 *   get:
 *     summary: Get all active airports
 *     tags: [Airports]
 *     responses:
 *       200:
 *         description: List of all active airports
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Airport'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/active', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ryanairClient.airports.getActive();
    const filteredResult: AirportSummary[] = result.map((airport: Airport) => ({
      name: airport.name,
      code: airport.code,
      country: airport.country?.name,
      timezone: airport.timeZone,
    }));
    res.json(filteredResult);
  } catch (error) {
    console.error('Error in /airports/active:', error);
    next(error);
  }
});

router.get('/closest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airport = await ryanairClient.airports.getClosest();
    const filteredResult: ClosestAirport = {
      name: airport.name,
      code: airport.code,
      country: airport.country?.name,
    };
    res.json(filteredResult);
  } catch (error) {
    console.error('Error in /airports/closest:', error);
    next(error);
  }
});

router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ryanairClient.airports.getNearby();
    const filteredResult: ClosestAirport[] = result.map((airport: AirportShort) => ({
      name: airport.name,
      code: airport.code,
      country: airport.country.name,
    }));
    res.json(filteredResult);
  } catch (error) {
    console.error('Error in /airports/nearby:', error);
    next(error);
  }
});

/**
 * @swagger
 * /api/airports/{code}:
 *   get:
 *     summary: Get airport information by IATA code
 *     tags: [Airports]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{3}$'
 *         description: 3-letter IATA airport code
 *         example: DUB
 *     responses:
 *       200:
 *         description: Airport information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AirportDetails'
 *       400:
 *         description: Invalid IATA code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:code',
  validateIataParams('code'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const airport = await ryanairClient.airports.getInfo(code);
      const airportDetails: AirportDetails = {
        name: airport.name,
        timezone: airport.timeZone,
        code: airport.code,
        city: airport.city.name,
        region: airport.region.name,
        country: airport.country.name,
        currency: airport.country.currency,
      };
      res.json(airportDetails);
    } catch (error) {
      console.error(`Error in /airports/:code:`, error);
      next(error);
    }
  }
);

router.get(
  '/:code/destinations',
  validateIataParams('code'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const result = await ryanairClient.airports.getDestinations(code);
      const filteredResult: AirportSummary[] = result.map((destination: Destination) => ({
        name: destination.arrivalAirport.name,
        code: destination.arrivalAirport.code,
        country: destination.arrivalAirport.country?.name,
        timezone: destination.arrivalAirport.timeZone,
      }));
      res.json(filteredResult);
    } catch (error) {
      console.error('Error in /airports/:code/destinations:', error);
      next(error);
    }
  }
);

router.get(
  '/:code/schedules',
  validateIataParams('code'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const schedules = await ryanairClient.airports.getSchedules(code);
      res.json(schedules);
    } catch (error) {
      console.error('Error in /airports/:code/schedules:', error);
      next(error);
    }
  }
);

router.get(
  '/:from/routes/:to',
  validateIataParams('from', 'to'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { from, to } = req.params;
      const routes = await ryanairClient.airports.findRoutes(from, to);
      res.json(routes);
    } catch (error) {
      console.error('Error in /airports/:from/routes/:to:', error);
      next(error);
    }
  }
);

export { router as default };

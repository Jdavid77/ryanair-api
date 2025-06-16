import { Router, Request, Response, NextFunction } from 'express';
import { ryanairClient } from '../utils/ryanairClient.js';
import { validateIataParams } from '../middleware/validation.js';

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
    const filteredResult = result.map((airport: any) => ({
      name: airport.name,
      code: airport.code,
      country: airport.country?.name,
      timezone: airport.timeZone
    }));
    res.json(filteredResult);
  } catch (error) {
    console.error('Error in /airports/active:', error);
    next(error);
  }
});

router.get('/active-v3', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ryanairClient.airports.getActiveV3();
    res.json(result);
  } catch (error) {
    console.error('Error in /airports/active-v3:', error);
    next(error);
  }
});

router.get('/closest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airport = await ryanairClient.airports.getClosest();
    res.json(airport);
  } catch (error) {
    console.error('Error in /airports/closest:', error);
    next(error);
  }
});

router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ryanairClient.airports.getNearby();
    res.json(result);
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
 *               $ref: '#/components/schemas/Airport'
 *       400:
 *         description: Invalid IATA code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 */
router.get('/:code', validateIataParams('code'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const airport = await ryanairClient.airports.getInfo(code);
    res.json(airport);
  } catch (error) {
    console.error(`Error in /airports/:code:`, error);
    next(error);
  }
});

router.get('/:code/destinations', validateIataParams('code'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const result = await ryanairClient.airports.getDestinations(code);
    const filteredResult = result.map((destination: any) => ({
      name: destination.arrivalAirport.name,
      code: destination.arrivalAirport.code,
      country: destination.arrivalAirport.country?.name,
      timezone: destination.arrivalAirport.timeZone
    }));
    res.json(filteredResult);
  } catch (error) {
    console.error('Error in /airports/:code/destinations:', error);
    next(error);
  }
});

router.get('/:code/schedules', validateIataParams('code'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const schedules = await ryanairClient.airports.getSchedules(code);
    res.json(schedules);
  } catch (error) {
    console.error('Error in /airports/:code/schedules:', error);
    next(error);
  }
});

router.get('/:from/routes/:to', validateIataParams('from', 'to'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.params;
    const routes = await ryanairClient.airports.findRoutes(from, to);
    res.json(routes);
  } catch (error) {
    console.error('Error in /airports/:from/routes/:to:', error);
    next(error);
  }
});

export { router as default };
import { Router, Request, Response, NextFunction } from 'express';
import { getRyanairModule } from '../utils/ryanairClient.js';
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
    const airports = await getRyanairModule('airports');
    const result = await airports.getActive();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/active-v3', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airports = await getRyanairModule('airports');
    const result = await airports.getActiveV3();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/closest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airports = await getRyanairModule('airports');
    const airport = await airports.getClosest();
    res.json(airport);
  } catch (error) {
    next(error);
  }
});

router.get('/nearby', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const airports = await getRyanairModule('airports');
    const result = await airports.getNearby();
    res.json(result);
  } catch (error) {
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
    const airports = await getRyanairModule('airports');
    const airport = await airports.getInfo(code);
    res.json(airport);
  } catch (error) {
    next(error);
  }
});

router.get('/:code/destinations', validateIataParams('code'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const airports = await getRyanairModule('airports');
    const destinations = await airports.getDestinations(code);
    res.json(destinations);
  } catch (error) {
    next(error);
  }
});

router.get('/:code/schedules', validateIataParams('code'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const airports = await getRyanairModule('airports');
    const schedules = await airports.getSchedules(code);
    res.json(schedules);
  } catch (error) {
    next(error);
  }
});

router.get('/:from/routes/:to', validateIataParams('from', 'to'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { from, to } = req.params;
    const airports = await getRyanairModule('airports');
    const routes = await airports.findRoutes(from, to);
    res.json(routes);
  } catch (error) {
    next(error);
  }
});

export { router as default };
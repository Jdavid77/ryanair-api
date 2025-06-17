import swaggerJsdoc from 'swagger-jsdoc';
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ryanair API',
      version: packageJson.version,
      description:
        'A production-ready REST API for accessing Ryanair flight data, airports, and fare information',
      contact: {
        name: 'API Support',
        url: 'https://github.com/example/ryanair-api',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' ? process.env.API_URL : 'http://localhost:3000',
        description:
          process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    paths: {
      '/health': {
        get: {
          summary: 'Health check endpoint',
          tags: ['System'],
          responses: {
            '200': {
              description: 'Service health status',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      timestamp: { type: 'string', format: 'date-time' },
                      uptime: { type: 'number', description: 'Server uptime in seconds' },
                      environment: { type: 'string', example: 'development' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/airports/active': {
        get: {
          summary: 'Get all active airports',
          tags: ['Airports'],
          responses: {
            '200': {
              description: 'List of all active airports',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/FilteredAirport' },
                  },
                },
              },
            },
            '500': {
              description: 'Internal server error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/airports/{code}': {
        get: {
          summary: 'Get airport information by IATA code',
          tags: ['Airports'],
          parameters: [
            {
              in: 'path',
              name: 'code',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: '3-letter IATA airport code',
              example: 'DUB',
            },
          ],
          responses: {
            '200': {
              description: 'Airport information',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/AirportDetails' },
                },
              },
            },
            '400': {
              description: 'Invalid IATA code',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/fares/cheapest-per-day': {
        get: {
          summary: 'Get cheapest fares per day for a route',
          tags: ['Fares'],
          parameters: [
            {
              in: 'query',
              name: 'from',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Departure airport IATA code',
              example: 'DUB',
            },
            {
              in: 'query',
              name: 'to',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Arrival airport IATA code',
              example: 'STN',
            },
            {
              in: 'query',
              name: 'startDate',
              required: true,
              schema: {
                type: 'string',
                format: 'date',
              },
              description: 'Start date in YYYY-MM-DD format',
              example: '2024-06-15',
            },
            {
              in: 'query',
              name: 'currency',
              required: false,
              schema: {
                type: 'string',
                default: 'EUR',
              },
              description: 'Currency code',
              example: 'EUR',
            },
          ],
          responses: {
            '200': {
              description: 'Cheapest fares per day',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Fare' },
                },
              },
            },
            '400': {
              description: 'Invalid parameters',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/flights/available': {
        get: {
          summary: 'Search for available flights',
          tags: ['Flights'],
          parameters: [
            {
              in: 'query',
              name: 'from',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Departure airport IATA code',
              example: 'DUB',
            },
            {
              in: 'query',
              name: 'to',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Arrival airport IATA code',
              example: 'STN',
            },
            {
              in: 'query',
              name: 'dateOut',
              required: false,
              schema: {
                type: 'string',
                format: 'date',
              },
              description: 'Departure date in YYYY-MM-DD format',
              example: '2024-06-15',
            },
            {
              in: 'query',
              name: 'adults',
              required: false,
              schema: {
                type: 'integer',
                minimum: 1,
                maximum: 9,
                default: 1,
              },
              description: 'Number of adult passengers',
            },
          ],
          responses: {
            '200': {
              description: 'Available flight options',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/FlightAvailability' },
                },
              },
            },
            '400': {
              description: 'Invalid parameters',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/flights/dates': {
        get: {
          summary: 'Get available flight dates',
          tags: ['Flights'],
          parameters: [
            {
              in: 'query',
              name: 'from',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Departure airport IATA code',
              example: 'DUB',
            },
            {
              in: 'query',
              name: 'to',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Arrival airport IATA code',
              example: 'STN',
            },
          ],
          responses: {
            '200': {
              description: 'Array of available dates',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'string',
                      format: 'date',
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/airports/closest': {
        get: {
          summary: 'Get closest airport based on IP',
          tags: ['Airports'],
          responses: {
            '200': {
              description: 'Closest airport information',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ClosestAirport' },
                },
              },
            },
          },
        },
      },
      '/api/airports/nearby': {
        get: {
          summary: 'Get nearby airports based on IP',
          tags: ['Airports'],
          responses: {
            '200': {
              description: 'List of nearby airports',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/ClosestAirport' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/airports/{code}/destinations': {
        get: {
          summary: 'Get destinations from airport',
          tags: ['Airports'],
          parameters: [
            {
              in: 'path',
              name: 'code',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: '3-letter IATA airport code',
              example: 'DUB',
            },
          ],
          responses: {
            '200': {
              description: 'List of destinations from the airport',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/FilteredAirport' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/airports/{code}/schedules': {
        get: {
          summary: 'Get flight schedules from airport',
          tags: ['Airports'],
          parameters: [
            {
              in: 'path',
              name: 'code',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: '3-letter IATA airport code',
              example: 'DUB',
            },
          ],
          responses: {
            '200': {
              description: 'Flight schedules from the airport',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      schedules: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            origin: { type: 'string' },
                            destination: { type: 'string' },
                            flightNumber: { type: 'string' },
                            departureTime: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/airports/{from}/routes/{to}': {
        get: {
          summary: 'Find routes between airports',
          tags: ['Airports'],
          parameters: [
            {
              in: 'path',
              name: 'from',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Departure airport IATA code',
              example: 'DUB',
            },
            {
              in: 'path',
              name: 'to',
              required: true,
              schema: {
                type: 'string',
                pattern: '^[A-Z]{3}$',
              },
              description: 'Arrival airport IATA code',
              example: 'STN',
            },
          ],
          responses: {
            '200': {
              description: 'Available routes between airports',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'array',
                      items: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/fares/daily-range': {
        get: {
          summary: 'Find daily fares in date range',
          tags: ['Fares'],
          parameters: [
            {
              in: 'query',
              name: 'from',
              required: true,
              schema: { type: 'string', pattern: '^[A-Z]{3}$' },
              description: 'Departure airport IATA code',
              example: 'DUB',
            },
            {
              in: 'query',
              name: 'to',
              required: true,
              schema: { type: 'string', pattern: '^[A-Z]{3}$' },
              description: 'Arrival airport IATA code',
              example: 'STN',
            },
            {
              in: 'query',
              name: 'startDate',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'Start date in YYYY-MM-DD format',
              example: '2024-06-15',
            },
            {
              in: 'query',
              name: 'endDate',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'End date in YYYY-MM-DD format',
              example: '2024-06-30',
            },
            {
              in: 'query',
              name: 'currency',
              required: false,
              schema: { type: 'string', default: 'EUR' },
              description: 'Currency code',
              example: 'EUR',
            },
          ],
          responses: {
            '200': {
              description: 'Daily fares in the specified range',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Fare' },
                  },
                },
              },
            },
          },
        },
      },
      '/api/fares/cheapest-round-trip': {
        get: {
          summary: 'Find cheapest round trip fares',
          tags: ['Fares'],
          parameters: [
            {
              in: 'query',
              name: 'from',
              required: true,
              schema: { type: 'string', pattern: '^[A-Z]{3}$' },
              description: 'Origin airport IATA code',
              example: 'DUB',
            },
            {
              in: 'query',
              name: 'to',
              required: true,
              schema: { type: 'string', pattern: '^[A-Z]{3}$' },
              description: 'Destination airport IATA code',
              example: 'STN',
            },
            {
              in: 'query',
              name: 'startDate',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'Outbound date in YYYY-MM-DD format',
              example: '2024-06-15',
            },
            {
              in: 'query',
              name: 'endDate',
              required: true,
              schema: { type: 'string', format: 'date' },
              description: 'Return date in YYYY-MM-DD format',
              example: '2024-06-30',
            },
            {
              in: 'query',
              name: 'currency',
              required: false,
              schema: { type: 'string', default: 'EUR' },
              description: 'Currency code',
              example: 'EUR',
            },
            {
              in: 'query',
              name: 'limit',
              required: false,
              schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
              description: 'Maximum number of results',
              example: 10,
            },
          ],
          responses: {
            '200': {
              description: 'Cheapest round trip options',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        outbound: { $ref: '#/components/schemas/Fare' },
                        inbound: { $ref: '#/components/schemas/Fare' },
                        totalPrice: {
                          type: 'object',
                          properties: {
                            value: { type: 'number' },
                            currencyCode: { type: 'string' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'System',
        description: 'System health and monitoring',
      },
      {
        name: 'Airports',
        description: 'Airport information and operations',
      },
      {
        name: 'Fares',
        description: 'Flight fare search and pricing',
      },
      {
        name: 'Flights',
        description: 'Flight availability and dates',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error type',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
        Airport: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            seoName: { type: 'string' },
            code: { type: 'string', description: 'IATA airport code' },
            base: { type: 'boolean' },
            coordinates: {
              type: 'object',
              properties: {
                latitude: { type: 'number' },
                longitude: { type: 'number' },
              },
            },
            timeZone: { type: 'string' },
            city: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                code: { type: 'string' },
              },
            },
            country: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                code: { type: 'string' },
                currency: { type: 'string' },
              },
            },
          },
        },
        FilteredAirport: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            code: { type: 'string', description: 'IATA airport code' },
            country: { type: 'string' },
            timezone: { type: 'string' },
          },
        },
        AirportDetails: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Dublin' },
            timezone: { type: 'string', example: 'Europe/Dublin' },
            code: { type: 'string', example: 'DUB' },
            city: { type: 'string', example: 'Dublin' },
            region: { type: 'string', example: 'Europe' },
            country: { type: 'string', example: 'Ireland' },
            currency: { type: 'string', example: 'EUR' },
          },
        },
        ClosestAirport: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Dublin' },
            code: { type: 'string', example: 'DUB' },
            country: { type: 'string', example: 'Ireland' },
          },
        },
        Fare: {
          type: 'object',
          properties: {
            outbound: {
              type: 'object',
              properties: {
                departureDate: { type: 'string', format: 'date' },
                price: {
                  type: 'object',
                  properties: {
                    value: { type: 'number' },
                    currencyCode: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        FlightAvailability: {
          type: 'object',
          properties: {
            termsOfUse: { type: 'string' },
            currency: { type: 'string' },
            trips: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  origin: { type: 'string' },
                  destination: { type: 'string' },
                  dates: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        dateOut: { type: 'string' },
                        flights: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              flightKey: { type: 'string' },
                              segments: {
                                type: 'array',
                                items: {
                                  type: 'object',
                                  properties: {
                                    origin: { type: 'string' },
                                    destination: { type: 'string' },
                                    flightNumber: { type: 'string' },
                                    time: { type: 'array', items: { type: 'string' } },
                                    duration: { type: 'string' },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const specs = swaggerJsdoc(options);

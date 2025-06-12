# Ryanair API

A production-ready Node.js REST API built with Express.js and TypeScript that provides access to Ryanair flight data using the [@2bad/ryanair](https://github.com/2BAD/ryanair) package.

## Features

- 🛫 **Airport Information**: Get active airports, destinations, schedules, and routes
- 💰 **Fare Search**: Find cheapest fares, daily fare ranges, and round-trip deals
- ✈️ **Flight Availability**: Check available flights and dates
- 🔒 **Production Ready**: Rate limiting, CORS, security headers, compression
- 📝 **TypeScript**: Full type safety and IntelliSense support
- 🛡️ **Error Handling**: Comprehensive validation and error responses
- 📖 **API Documentation**: Interactive Swagger/OpenAPI documentation

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   ```

3. **Run in development**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

The API will be available at `http://localhost:3000` and the interactive documentation at `http://localhost:3000/api-docs`.

## API Endpoints

### Airports (`/api/airports`)

- `GET /api/airports/active` - Get all active airports
- `GET /api/airports/active-v3` - Get all active airports (v3 format)
- `GET /api/airports/closest` - Get closest airport based on IP
- `GET /api/airports/nearby` - Get nearby airports based on IP
- `GET /api/airports/:code` - Get airport info by IATA code
- `GET /api/airports/:code/destinations` - Get destinations from airport
- `GET /api/airports/:code/schedules` - Get flight schedules from airport
- `GET /api/airports/:from/schedules/:to` - Get schedules between airports
- `GET /api/airports/:from/schedules/:to/:year/:month` - Get monthly schedules
- `GET /api/airports/:from/routes/:to` - Find routes between airports

### Fares (`/api/fares`)

- `GET /api/fares/cheapest-per-day?from=DUB&to=STN&startDate=2024-06-15&currency=EUR`
- `GET /api/fares/daily-range?from=DUB&to=STN&startDate=2024-06-15&endDate=2024-06-30&currency=EUR`
- `GET /api/fares/cheapest-round-trip?from=DUB&to=STN&startDate=2024-06-15&endDate=2024-06-30&currency=EUR&limit=10`

### Flights (`/api/flights`)

- `GET /api/flights/dates?from=DUB&to=STN` - Get available flight dates
- `GET /api/flights/available?from=DUB&to=STN&dateOut=2024-06-15&adults=1&children=0`

## Environment Variables

```bash
PORT=3000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX=100           # Max requests per window
```

## Error Handling

The API returns structured error responses:

```json
{
  "error": "Invalid IATA Code",
  "message": "Please provide a valid 3-letter IATA airport code"
}
```

## Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables
- Returns `429 Too Many Requests` when exceeded

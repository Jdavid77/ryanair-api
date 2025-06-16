// Re-export all types from the @2bad/ryanair package
export type {
  // Airport types
  IataCode,
  Location,
  Country,
  Coordinates,
  AirportShort,
  AirportConnection,
  AirportBase,
  AirportV3,
  Airport,
  Destination,
  Schedule,
  Schedules,

  // Fare types
  Price,
  Fare,
  CheapestFares,
  RoundTrip,

  // Flight types
  AvailabilityOptions,
  Segment,
  FlightFare,
  FareType,
  Flight,
  FlightDate,
  Trip,
  AvailabilityResponse,
} from '@2bad/ryanair';

// Custom types for our API responses (simplified versions)
export interface AirportSummary {
  name: string;
  code: string;
  country?: string;
  timezone: string;
}

export interface ClosestAirport {
  name: string;
  code: string;
  country?: string;
}

export interface AirportDetails {
  name: string;
  timezone: string;
  code: string;
  city: string;
  region: string;
  country: string;
  currency: string;
}

// Flight search options interface (our simplified version)
export interface FlightSearchOptions {
  Origin: string;
  Destination: string;
  ADT: number;
  CHD: number;
  TEEN: number;
  INF: number;
  DateOut: string;
  DateIn?: string;
  FlexDaysOut?: number;
  FlexDaysIn?: number;
  RoundTrip?: boolean;
  ToUs?: string;
}

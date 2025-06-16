/**
 * Centralized Ryanair API client with pre-loaded modules
 */
import { airports, fares, flights } from '@2bad/ryanair';

export const ryanairClient = {
  airports,
  fares,
  flights
};
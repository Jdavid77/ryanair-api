/**
 * Standardized response helpers for consistent API responses
 */
import { Response } from 'express';

export const sendValidationError = (res: Response, message: string, field?: string): void => {
  res.status(400).json({
    error: 'Validation Error',
    message,
    field,
  });
};

export const sendMissingParametersError = (res: Response, missingParams: string[]): void => {
  res.status(400).json({
    error: 'Missing required parameters',
    message: `The following parameters are required: ${missingParams.join(', ')}`,
  });
};

export const sendInvalidIataError = (res: Response, codes: string[]): void => {
  res.status(400).json({
    error: 'Invalid IATA codes',
    message: `All IATA codes must be exactly 3 characters: ${codes.join(', ')}`,
  });
};

export const sendInvalidDateError = (res: Response, dates: string[]): void => {
  res.status(400).json({
    error: 'Invalid date format',
    message: `Dates must be in YYYY-MM-DD format: ${dates.join(', ')}`,
  });
};

export const sendDateRangeError = (res: Response): void => {
  res.status(400).json({
    error: 'Invalid date range',
    message: 'Start date must be before or equal to end date',
  });
};

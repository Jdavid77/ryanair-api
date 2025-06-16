/**
 * Reusable validation middleware
 */
import { Request, Response, NextFunction } from 'express';
import { validateIataCode, validateDate } from '../utils/validation.js';
import {
  sendInvalidIataError,
  sendInvalidDateError,
  sendDateRangeError,
  sendMissingParametersError,
} from '../utils/responseHelpers.js';

export const validateIataParams = (...paramNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const invalidCodes: string[] = [];

    for (const paramName of paramNames) {
      const code = req.params[paramName] || req.query[paramName];
      if (code && !validateIataCode((code as string).toUpperCase())) {
        invalidCodes.push(paramName);
      }
    }

    if (invalidCodes.length > 0) {
      return sendInvalidIataError(res, invalidCodes);
    }

    // Convert to uppercase for consistency
    for (const paramName of paramNames) {
      if (req.params[paramName]) {
        req.params[paramName] = (req.params[paramName] as string).toUpperCase();
      }
      if (req.query[paramName]) {
        req.query[paramName] = (req.query[paramName] as string).toUpperCase();
      }
    }

    next();
  };
};

export const validateDateParams = (...paramNames: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const invalidDates: string[] = [];

    for (const paramName of paramNames) {
      const date = req.query[paramName];
      if (date && !validateDate(date as string)) {
        invalidDates.push(paramName);
      }
    }

    if (invalidDates.length > 0) {
      return sendInvalidDateError(res, invalidDates);
    }

    next();
  };
};

export const validateRequiredParams = (
  paramNames: string[],
  source: 'query' | 'params' = 'query'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = source === 'query' ? req.query : req.params;
    const missing: string[] = [];

    for (const paramName of paramNames) {
      if (!data[paramName]) {
        missing.push(paramName);
      }
    }

    if (missing.length > 0) {
      return sendMissingParametersError(res, missing);
    }

    next();
  };
};

export const validateDateRange = (startDateParam = 'startDate', endDateParam = 'endDate') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.query[startDateParam] as string;
    const endDate = req.query[endDateParam] as string;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return sendDateRangeError(res);
    }

    next();
  };
};

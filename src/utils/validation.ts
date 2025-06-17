/**
 * Validation utilities for API inputs
 */

export const validateIataCode = (code: string): boolean => {
  return !!(code && code.length === 3 && /^[A-Z]{3}$/.test(code));
};

export const validateDate = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
};

export const validatePassengerCount = (count: number, min = 0, max = 9): boolean => {
  return !isNaN(count) && count >= min && count <= max;
};

export const validateCurrency = (currency: string): boolean => {
  const validCurrencies = ['EUR', 'USD', 'GBP', 'PLN', 'CZK', 'HUF', 'SEK', 'NOK', 'DKK'];
  return validCurrencies.includes(currency.toUpperCase());
};

export const validateDateRange = (startDate: string, endDate: string): boolean => {
  if (!validateDate(startDate) || !validateDate(endDate)) {
    return false;
  }
  return new Date(startDate) <= new Date(endDate);
};

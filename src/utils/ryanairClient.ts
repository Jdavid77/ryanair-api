/**
 * Centralized Ryanair API client with dynamic imports
 */

let ryanairModules: {
  airports?: any;
  fares?: any;
  flights?: any;
} = {};

export const getRyanairModule = async (moduleName: 'airports' | 'fares' | 'flights') => {
  if (!ryanairModules[moduleName]) {
    const ryanairPackage = await import('@2bad/ryanair');
    ryanairModules[moduleName] = ryanairPackage[moduleName];
  }
  return ryanairModules[moduleName];
};
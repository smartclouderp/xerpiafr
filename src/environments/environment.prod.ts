import { Environment } from '../app/shared/models/environment.interface';

export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.xerpia.com/api',
  appName: 'Xerpia ERP',
  appVersion: '1.0.0',
  jwtSecretKey: 'your-production-secret-key-here',
  corsOrigin: 'https://xerpia.com',
  refreshTokenExpiry: '7d',
  accessTokenExpiry: '1h',
  logLevel: 'error'
};

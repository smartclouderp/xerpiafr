import { Environment } from '../app/shared/models/environment.interface';

export const environment: Environment = {
  production: false,
  apiUrl: '/api', // Using proxy path to avoid CORS
  appName: 'Xerpia ERP',
  appVersion: '1.0.0',
  jwtSecretKey: 'your-secret-key-here',
  corsOrigin: 'http://localhost:4200',
  refreshTokenExpiry: '7d',
  accessTokenExpiry: '1h',
  logLevel: 'debug'
};

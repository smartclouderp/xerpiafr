export interface Environment {
  production: boolean;
  apiUrl: string;
  appName: string;
  appVersion: string;
  jwtSecretKey: string;
  corsOrigin: string;
  refreshTokenExpiry: string;
  accessTokenExpiry: string;
  logLevel: string;
}

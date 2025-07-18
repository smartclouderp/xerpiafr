import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4
}

export interface LogEntry {
  timestamp: string;
  level: string;
  category: string;
  message: string;
  data?: any;
  requestId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private currentLevel = LogLevel.DEBUG;
  private requestIdCounter = 0;

  constructor() {
    this.info('Logger', 'Logger service initialized');
    this.logEnvironmentInfo();
  }

  private logEnvironmentInfo() {
    this.info('Environment', 'Application started', {
      production: environment.production,
      apiUrl: environment.apiUrl,
      appName: environment.appName,
      appVersion: environment.appVersion,
      timestamp: new Date().toISOString()
    });
  }

  generateRequestId(): string {
    return `req_${++this.requestIdCounter}_${Date.now()}`;
  }

  error(category: string, message: string, data?: any, requestId?: string) {
    this.log(LogLevel.ERROR, category, message, data, requestId);
  }

  warn(category: string, message: string, data?: any, requestId?: string) {
    this.log(LogLevel.WARN, category, message, data, requestId);
  }

  info(category: string, message: string, data?: any, requestId?: string) {
    this.log(LogLevel.INFO, category, message, data, requestId);
  }

  debug(category: string, message: string, data?: any, requestId?: string) {
    this.log(LogLevel.DEBUG, category, message, data, requestId);
  }

  trace(category: string, message: string, data?: any, requestId?: string) {
    this.log(LogLevel.TRACE, category, message, data, requestId);
  }

  private log(level: LogLevel, category: string, message: string, data?: any, requestId?: string) {
    if (level <= this.currentLevel) {
      const logEntry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel[level],
        category,
        message,
        data,
        requestId
      };

      this.logs.push(logEntry);
      
      // Mantener solo los últimos logs
      if (this.logs.length > this.maxLogs) {
        this.logs.shift();
      }

      // Console output para desarrollo
      if (!environment.production) {
        this.consoleLog(logEntry);
      }
    }
  }

  private consoleLog(entry: LogEntry) {
    const style = this.getConsoleStyle(entry.level);
    const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.category}]`;
    
    console.group(`%c${prefix} ${entry.message}`, style);
    
    if (entry.requestId) {
      console.log(`🔗 Request ID: ${entry.requestId}`);
    }
    
    if (entry.data) {
      console.log('📊 Data:', entry.data);
    }
    
    console.groupEnd();
  }

  private getConsoleStyle(level: string): string {
    const styles = {
      'ERROR': 'color: #ff4444; font-weight: bold;',
      'WARN': 'color: #ffaa00; font-weight: bold;',
      'INFO': 'color: #0088ff; font-weight: bold;',
      'DEBUG': 'color: #888888;',
      'TRACE': 'color: #cccccc;'
    };
    return styles[level as keyof typeof styles] || '';
  }

  // Métodos para obtener logs
  getAllLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLogsByCategory(category: string): LogEntry[] {
    return this.logs.filter(log => log.category === category);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === LogLevel[level]);
  }

  getLogsByRequestId(requestId: string): LogEntry[] {
    return this.logs.filter(log => log.requestId === requestId);
  }

  getRecentLogs(count: number = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  clearLogs() {
    this.logs = [];
    this.info('Logger', 'Logs cleared');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Métodos para logging específico de HTTP
  logHttpRequest(method: string, url: string, body?: any, headers?: any, requestId?: string) {
    this.debug('HTTP_REQUEST', `${method} ${url}`, {
      method,
      url,
      body,
      headers,
      timestamp: new Date().toISOString()
    }, requestId);
  }

  logHttpResponse(status: number, url: string, response?: any, requestId?: string) {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.DEBUG;
    this.log(level, 'HTTP_RESPONSE', `${status} ${url}`, {
      status,
      url,
      response,
      timestamp: new Date().toISOString()
    }, requestId);
  }

  logHttpError(error: any, url: string, requestId?: string) {
    this.error('HTTP_ERROR', `Request failed: ${url}`, {
      url,
      error: {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        error: error.error
      },
      timestamp: new Date().toISOString()
    }, requestId);
  }

  // Métodos para logging de autenticación
  logAuthAttempt(username: string, requestId?: string) {
    this.info('AUTH_ATTEMPT', `Login attempt for user: ${username}`, {
      username,
      timestamp: new Date().toISOString()
    }, requestId);
  }

  logAuthSuccess(token: string, user: any, requestId?: string) {
    this.info('AUTH_SUCCESS', 'Authentication successful', {
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...',
      user: {
        username: user?.username,
        role: user?.role,
        email: user?.email
      },
      timestamp: new Date().toISOString()
    }, requestId);
  }

  logAuthFailure(error: any, requestId?: string) {
    this.error('AUTH_FAILURE', 'Authentication failed', {
      error: {
        message: error.message,
        status: error.status,
        details: error.error
      },
      timestamp: new Date().toISOString()
    }, requestId);
  }

  logTokenDecoding(token: string, decodedPayload: any, requestId?: string) {
    this.debug('TOKEN_DECODE', 'JWT token decoded', {
      tokenLength: token.length,
      payload: decodedPayload,
      timestamp: new Date().toISOString()
    }, requestId);
  }

  logSessionManagement(action: string, data?: any, requestId?: string) {
    this.info('SESSION', `Session ${action}`, {
      action,
      data,
      timestamp: new Date().toISOString()
    }, requestId);
  }

  // Métodos para logging de proxy
  logProxyRequest(originalUrl: string, targetUrl: string, requestId?: string) {
    this.debug('PROXY_REQUEST', `Proxying request`, {
      originalUrl,
      targetUrl,
      timestamp: new Date().toISOString()
    }, requestId);
  }

  logProxyError(originalUrl: string, error: any, requestId?: string) {
    this.error('PROXY_ERROR', `Proxy request failed`, {
      originalUrl,
      error,
      timestamp: new Date().toISOString()
    }, requestId);
  }
}

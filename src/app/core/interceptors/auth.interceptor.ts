import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService,
    private logger: LoggerService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestId = this.logger.generateRequestId();
    
    // Skip auth header for login, register, and refresh endpoints
    const isAuthEndpoint = req.url.includes('/login') || 
                          req.url.includes('/register') || 
                          req.url.includes('/refresh');
    
    this.logger.debug('AuthInterceptor', `Intercepting request: ${req.method} ${req.url}`, {
      isAuthEndpoint,
      headers: req.headers.keys().reduce((acc, key) => ({ ...acc, [key]: req.headers.get(key) }), {})
    }, requestId);
    
    if (isAuthEndpoint) {
      this.logger.debug('AuthInterceptor', 'Skipping auth header for auth endpoint', { url: req.url }, requestId);
      return next.handle(req).pipe(
        tap(event => {
          this.logger.debug('AuthInterceptor', 'Auth endpoint response received', { event }, requestId);
        }),
        catchError((error: HttpErrorResponse) => {
          this.logger.error('AuthInterceptor', 'Auth endpoint error', error, requestId);
          return throwError(() => error);
        })
      );
    }

    // Add auth header with jwt token if available
    const token = this.authService.getToken();
    if (token) {
      console.log('🔒 Adding auth header for:', req.url);
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && token) {
          console.log('🔄 Handling 401 error for:', req.url);
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          if (response.success && response.data) {
            this.refreshTokenSubject.next(response.data.accessToken);
            return next.handle(this.addToken(request, response.data.accessToken));
          }
          this.authService.logout();
          return throwError(() => new Error('Token refresh failed'));
        }),
        catchError((error) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}

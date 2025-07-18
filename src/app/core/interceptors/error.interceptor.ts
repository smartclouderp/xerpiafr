import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('🚨 HTTP Error Interceptor caught:', {
          url: req.url,
          method: req.method,
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });

        let errorMessage = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Client Error: ${error.error.message}`;
          console.error('📱 Client-side error:', error.error);
        } else {
          // Server-side error
          console.error('🖥️ Server-side error:', {
            status: error.status,
            body: error.error,
            headers: error.headers
          });
          
          switch (error.status) {
            case 0:
              errorMessage = 'Network error - unable to connect to server';
              break;
            case 400:
              errorMessage = error.error?.message || 'Bad Request';
              break;
            case 401:
              errorMessage = 'Unauthorized access';
              break;
            case 403:
              errorMessage = 'Access forbidden';
              break;
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 500:
              errorMessage = 'Internal server error';
              break;
            default:
              errorMessage = `Server Error: ${error.status} - ${error.message}`;
          }
        }

        // Log error to console (in production, you might want to send to logging service)
        console.error('HTTP Error:', {
          status: error.status,
          message: errorMessage,
          url: error.url,
          error: error.error
        });

        return throwError(() => ({
          ...error,
          userMessage: errorMessage
        }));
      })
    );
  }
}

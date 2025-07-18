import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, LoginResponse, JwtPayload } from '../../shared/models/user.interface';
import { ApiResponse } from '../../shared/models/api-response.interface';
import { LoggerService } from '../../shared/services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'xerpia_access_token';
  private readonly REFRESH_TOKEN_KEY = 'xerpia_refresh_token';
  private readonly USER_KEY = 'xerpia_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private router: Router,
    private logger: LoggerService
  ) {
    this.logger.info('AuthService', 'Service initialized');
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getToken();
    const user = this.getStoredUser();
    
    if (token && !this.jwtHelper.isTokenExpired(token) && user) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    } else {
      this.logout();
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    const requestId = this.logger.generateRequestId();
    
    this.logger.logAuthAttempt(credentials.username, requestId);
    this.logger.info('AuthService', 'Starting login process', { 
      endpoint: `${environment.apiUrl}/login`,
      username: credentials.username 
    }, requestId);
    
    // Configure headers to avoid CORS preflight when possible
    const headers = {
      'Content-Type': 'application/json'
    };
    
    this.logger.logHttpRequest('POST', `${environment.apiUrl}/login`, credentials, headers, requestId);
    
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/login`,
      credentials,
      { headers }
    ).pipe(
      tap(response => {
        this.logger.logHttpResponse(200, `${environment.apiUrl}/login`, response, requestId);
        
        if (response.token) {
          this.logger.info('AuthService', 'Token received, processing session', {
            tokenLength: response.token.length,
            tokenPreview: response.token.substring(0, 20) + '...'
          }, requestId);
          this.processTokenAndSetSession(response.token, requestId);
        } else {
          this.logger.error('AuthService', 'No token in response', response, requestId);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.logger.logHttpError(error, `${environment.apiUrl}/login`, requestId);
        this.logger.logAuthFailure(error, requestId);
        
        // Create user-friendly error message
        let userMessage = 'Login failed. Please try again.';
        
        if (error.status === 0) {
          userMessage = 'Unable to connect to server. Please check your connection and CORS configuration.';
        } else if (error.status === 404 && error.url?.includes('OPTIONS')) {
          userMessage = 'CORS preflight failed. The server needs to be configured to handle OPTIONS requests.';
        } else if (error.status === 401) {
          userMessage = 'Invalid username or password.';
        } else if (error.status === 403) {
          userMessage = 'Access denied. Please contact administrator.';
        } else if (error.status === 404) {
          userMessage = 'Login service not found. Please contact support.';
        } else if (error.status >= 500) {
          userMessage = 'Server error. Please try again later.';
        }
        
        return throwError(() => ({ 
          ...error, 
          userMessage 
        }));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<ApiResponse<LoginResponse>>(
      `${environment.apiUrl}/refresh`,
      { refreshToken }
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setSession(response.data);
        }
      })
    );
  }

  register(userData: any): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(
      `${environment.apiUrl}/register`,
      userData
    );
  }

  private processTokenAndSetSession(token: string, requestId?: string): void {
    try {
      // Decode JWT to extract user information
      const decodedToken = this.jwtHelper.decodeToken(token) as JwtPayload;
      
      if (!decodedToken) {
        throw new Error('Invalid token - cannot decode');
      }
      
      this.logger.logTokenDecoding(token, decodedToken, requestId);

      // Create user object from JWT payload
      const user: User = {
        id: decodedToken.sub,
        username: decodedToken.username || 'Unknown',
        email: decodedToken.email || '',
        firstName: decodedToken.firstName || '',
        lastName: decodedToken.lastName || '',
        role: decodedToken.role || 'employee',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('👤 Created user object:', user);

      // Store token and user info
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      
      // Update observables
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);

      console.log('✅ Session established successfully');
      console.log('🔑 User role:', user.role);

    } catch (error) {
      console.error('❌ Error processing JWT token:', error);
      this.logout();
    }
  }

  private setSession(authResult: any): void {
    localStorage.setItem(this.TOKEN_KEY, authResult.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResult.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResult.user));
    
    this.currentUserSubject.next(authResult.user);
    this.isAuthenticatedSubject.next(true);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  hasRole(requiredRoles: string[]): boolean {
    const userRole = this.getUserRole();
    return userRole ? requiredRoles.includes(userRole) : false;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? !this.jwtHelper.isTokenExpired(token) : false;
  }

  getTokenPayload(): JwtPayload | null {
    const token = this.getToken();
    return token ? this.jwtHelper.decodeToken(token) : null;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getCurrentUser();
    return user ? roles.includes(user.role) : false;
  }
}

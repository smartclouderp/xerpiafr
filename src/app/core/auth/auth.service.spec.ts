import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('Login API Test', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let jwtHelperSpy: jasmine.SpyObj<JwtHelperService>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const jwtSpyObj = jasmine.createSpyObj('JwtHelperService', ['isTokenExpired', 'decodeToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: JwtHelperService, useValue: jwtSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    jwtHelperSpy = TestBed.inject(JwtHelperService) as jasmine.SpyObj<JwtHelperService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send login request to correct endpoint', () => {
    const mockCredentials = {
      username: 'admin',
      password: '123456'
    };

    const mockResponse = {
      success: true,
      data: {
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          username: 'admin',
          email: 'admin@xerpia.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        expiresIn: 3600
      },
      message: 'Login successful'
    };

    service.login(mockCredentials).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data?.user.username).toBe('admin');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    
    req.flush(mockResponse);
  });
});

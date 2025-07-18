import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../../../shared/models/user.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>{{ appName }}</h1>
          <h2>Sign In</h2>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              class="form-control"
              [class.error]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
            />
            <div class="error-message" *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
              <span *ngIf="loginForm.get('username')?.errors?.['required']">Username is required</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              class="form-control"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
            />
            <div class="error-message" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
            </div>
          </div>

          <button type="submit" class="login-btn" [disabled]="loginForm.invalid || loading">
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>

          <div class="error-message" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>
        </form>

        <div class="login-footer">
          <p>Don't have an account? <a routerLink="/register">Sign Up</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1rem;
    }

    .login-card {
      background: white;
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h1 {
      color: #2196F3;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
    }

    .login-header h2 {
      color: #666;
      margin: 0;
      font-weight: normal;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #2196F3;
    }

    .form-control.error {
      border-color: #f44336;
    }

    .error-message {
      color: #f44336;
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .login-btn:hover:not(:disabled) {
      background: #1976D2;
    }

    .login-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .login-footer {
      text-align: center;
      margin-top: 1.5rem;
    }

    .login-footer a {
      color: #2196F3;
      text-decoration: none;
    }

    .login-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  appName = 'Xerpia ERP';
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      console.log('📝 Login form submitted:', this.loginForm.value);

      this.authService.login(this.loginForm.value).subscribe({
        next: (response: LoginResponse) => {
          console.log('🎉 Login successful! Token received:', response.token.substring(0, 30) + '...');
          this.loading = false;
          
          // Get user role for redirection
          const userRole = this.authService.getUserRole();
          console.log('👤 User role:', userRole);
          
          // Redirect based on role
          this.redirectByRole(userRole);
        },
        error: (error: any) => {
          console.error('💥 Login component error:', error);
          this.loading = false;
          this.errorMessage = error.userMessage || error.message || 'An error occurred during login';
          
          // Additional debugging info
          if (error.status === 0) {
            console.error('🌐 Network Error - Check if backend is running');
          }
        }
      });
    } else {
      console.warn('⚠️ Login form is invalid:', this.loginForm.errors);
    }
  }

  private redirectByRole(role: string | null): void {
    console.log('🧭 Redirecting user based on role:', role);
    
    switch (role) {
      case 'admin':
        console.log('🔐 Admin user - redirecting to dashboard');
        this.router.navigate(['/dashboard']);
        break;
      case 'manager':
        console.log('👔 Manager user - redirecting to dashboard');
        this.router.navigate(['/dashboard']);
        break;
      case 'employee':
        console.log('👨‍💼 Employee user - redirecting to dashboard');
        this.router.navigate(['/dashboard']);
        break;
      default:
        console.log('👤 Default redirection to dashboard');
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-debug-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: monospace;">
      <h2>🔍 Login Debug Tool</h2>
      
      <div style="background: #e8f5e8; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>✅ Configuración de Proxy Activada</h3>
        <p><strong>API URL:</strong> {{ apiUrl }}</p>
        <p><strong>Login Endpoint:</strong> {{ loginEndpoint }}</p>
        <p><strong>Proxy Target:</strong> http://localhost/xerpia/public</p>
        <p><strong>Status:</strong> Las peticiones a /api/* serán redirigidas automáticamente</p>
      </div>

      <div style="background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>Test Credentials:</h3>
        <label>Username: <input [(ngModel)]="username" style="margin-left: 10px;"></label><br><br>
        <label>Password: <input [(ngModel)]="password" type="password" style="margin-left: 10px;"></label><br><br>
        <button (click)="testLogin()" [disabled]="loading" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 3px;">
          {{ loading ? 'Testing...' : 'Test Login' }}
        </button>
      </div>

      <div *ngIf="result" style="background: white; border: 1px solid #ddd; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>Result:</h3>
        <pre style="white-space: pre-wrap; font-size: 12px;">{{ result }}</pre>
      </div>

      <div *ngIf="logs.length > 0" style="background: #fff3e0; border: 1px solid #ff9800; padding: 15px; margin: 10px 0; border-radius: 5px;">
        <h3>Debug Logs:</h3>
        <div *ngFor="let log of logs" style="margin: 5px 0; font-size: 12px;">
          <span [style.color]="log.type === 'error' ? 'red' : log.type === 'success' ? 'green' : 'blue'">
            [{{ log.timestamp }}] {{ log.message }}
          </span>
        </div>
      </div>
    </div>
  `
})
export class DebugLoginComponent {
  apiUrl = environment.apiUrl;
  loginEndpoint = `${environment.apiUrl}/login`;
  username = 'admin';
  password = '123456';
  loading = false;
  result = '';
  logs: any[] = [];

  constructor(private http: HttpClient) {}

  private log(message: string, type: 'info' | 'success' | 'error' = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push({ message, type, timestamp });
    console.log(`[${timestamp}] ${message}`);
  }

  async testLogin() {
    this.loading = true;
    this.result = '';
    this.logs = [];

    this.log('🚀 Starting login test...', 'info');
    this.log(`📡 Endpoint: ${this.loginEndpoint}`, 'info');
    this.log(`👤 Username: ${this.username}`, 'info');

    const credentials = {
      username: this.username,
      password: this.password
    };

    try {
      this.log('📝 Sending POST request...', 'info');
      
      const response = await this.http.post<{token: string}>(this.loginEndpoint, credentials).toPromise();
      
      this.log('✅ Response received successfully!', 'success');
      this.log(`🔑 Token received: ${response!.token.substring(0, 50)}...`, 'success');
      
      this.result = JSON.stringify(response, null, 2);
      
      // Test token decoding
      try {
        const tokenParts = response!.token.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        this.log(`👤 Token payload decoded:`, 'info');
        this.log(`   - Username: ${payload.username}`, 'info');
        this.log(`   - Sub: ${payload.sub}`, 'info');
        this.log(`   - Expires: ${new Date(payload.exp * 1000).toLocaleString()}`, 'info');
      } catch (decodeError) {
        this.log('⚠️ Could not decode token payload', 'error');
      }
      
    } catch (error: any) {
      this.log('❌ Request failed!', 'error');
      
      if (error.status === 0) {
        this.log('🌐 Network error - Cannot connect to server', 'error');
      } else {
        this.log(`🚨 HTTP ${error.status}: ${error.statusText}`, 'error');
      }
      
      this.result = JSON.stringify({
        error: true,
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url,
        body: error.error
      }, null, 2);
    }

    this.loading = false;
  }
}

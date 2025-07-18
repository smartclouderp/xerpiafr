import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-proxy-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2>🔧 Proxy Configuration Test</h2>
      
      <div style="background: #f0f8ff; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #0066cc;">
        <h3>Configuration Details:</h3>
        <p><strong>Environment API URL:</strong> {{ apiUrl }}</p>
        <p><strong>Proxy Target:</strong> http://localhost/xerpia/public</p>
        <p><strong>Expected Behavior:</strong> /api/login → http://localhost/xerpia/public/login</p>
      </div>

      <div style="margin: 20px 0;">
        <button (click)="testProxyEndpoint()" 
                style="background: #007acc; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
          🧪 Test Proxy Endpoint
        </button>
        
        <button (click)="testDirectEndpoint()" 
                style="background: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
          🎯 Test Direct Endpoint
        </button>
      </div>

      <div *ngIf="testResults.length > 0" style="margin-top: 20px;">
        <h3>Test Results:</h3>
        <div *ngFor="let result of testResults" 
             [style.background]="result.success ? '#d4edda' : '#f8d7da'"
             [style.color]="result.success ? '#155724' : '#721c24'"
             style="padding: 10px; margin: 5px 0; border-radius: 5px; border: 1px solid; font-family: monospace;">
          <strong>{{ result.label }}:</strong><br>
          <strong>Status:</strong> {{ result.status }}<br>
          <strong>Message:</strong> {{ result.message }}<br>
          <strong>URL:</strong> {{ result.url }}<br>
          <strong>Time:</strong> {{ result.timestamp | date:'medium' }}
        </div>
      </div>

      <div style="background: #fff3cd; padding: 15px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #ffc107;">
        <h3>⚠️ Troubleshooting Tips:</h3>
        <ul>
          <li>Make sure <code>ng serve</code> is running with <code>--proxy-config proxy.conf.json</code></li>
          <li>Check that your backend is running on <code>http://localhost/xerpia/public</code></li>
          <li>Verify the proxy.conf.json file is in the root directory</li>
          <li>Check browser developer tools Network tab for actual request URLs</li>
        </ul>
      </div>
    </div>
  `
})
export class ProxyTestComponent {
  private http = inject(HttpClient);
  
  apiUrl = environment.apiUrl;
  testResults: any[] = [];

  testProxyEndpoint() {
    const proxyUrl = '/api/login';
    console.log('Testing proxy endpoint:', proxyUrl);
    
    this.http.post(proxyUrl, { username: 'test', password: 'test' })
      .subscribe({
        next: (response) => {
          this.addTestResult('Proxy Endpoint', true, 'SUCCESS', 
            'Proxy is working correctly', proxyUrl);
        },
        error: (error) => {
          console.error('Proxy test error:', error);
          this.addTestResult('Proxy Endpoint', false, error.status || 'ERROR', 
            error.message || 'Proxy test failed', proxyUrl);
        }
      });
  }

  testDirectEndpoint() {
    const directUrl = 'http://localhost/xerpia/public/login';
    console.log('Testing direct endpoint:', directUrl);
    
    this.http.post(directUrl, { username: 'test', password: 'test' })
      .subscribe({
        next: (response) => {
          this.addTestResult('Direct Endpoint', true, 'SUCCESS', 
            'Direct endpoint is accessible', directUrl);
        },
        error: (error) => {
          console.error('Direct test error:', error);
          this.addTestResult('Direct Endpoint', false, error.status || 'ERROR', 
            error.message || 'Direct endpoint test failed', directUrl);
        }
      });
  }

  private addTestResult(label: string, success: boolean, status: string, message: string, url: string) {
    this.testResults.unshift({
      label,
      success,
      status,
      message,
      url,
      timestamp: new Date()
    });
  }
}

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoggerService, LogEntry, LogLevel } from '../../services/logger.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-log-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; min-height: 100vh;">
      <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2>📊 System Logs - Real Time Monitor</h2>
        
        <!-- Controls -->
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <button (click)="toggleAutoRefresh()" 
                    [style.background]="autoRefresh ? '#28a745' : '#6c757d'"
                    style="color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
              {{ autoRefresh ? '⏸️ Pause' : '▶️ Resume' }} Auto-refresh
            </button>
            
            <button (click)="clearLogs()" 
                    style="background: #dc3545; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
              🗑️ Clear Logs
            </button>
            
            <button (click)="exportLogs()" 
                    style="background: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
              💾 Export Logs
            </button>
            
            <select [(ngModel)]="selectedLevel" (change)="filterLogs()" 
                    style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="">All Levels</option>
              <option value="ERROR">ERROR</option>
              <option value="WARN">WARN</option>
              <option value="INFO">INFO</option>
              <option value="DEBUG">DEBUG</option>
              <option value="TRACE">TRACE</option>
            </select>
            
            <select [(ngModel)]="selectedCategory" (change)="filterLogs()" 
                    style="padding: 8px; border: 1px solid #ccc; border-radius: 4px;">
              <option value="">All Categories</option>
              <option value="AuthService">Authentication</option>
              <option value="HTTP_REQUEST">HTTP Requests</option>
              <option value="HTTP_RESPONSE">HTTP Responses</option>
              <option value="HTTP_ERROR">HTTP Errors</option>
              <option value="PROXY_REQUEST">Proxy Requests</option>
              <option value="PROXY_ERROR">Proxy Errors</option>
              <option value="AUTH_ATTEMPT">Login Attempts</option>
              <option value="AUTH_SUCCESS">Login Success</option>
              <option value="AUTH_FAILURE">Login Failures</option>
              <option value="TOKEN_DECODE">Token Decoding</option>
              <option value="SESSION">Session Management</option>
            </select>
            
            <span style="margin-left: 20px; color: #6c757d;">
              Total logs: {{ totalLogs }} | Displayed: {{ filteredLogs.length }}
            </span>
          </div>
        </div>

        <!-- Statistics -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0;">
          <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; text-align: center;">
            <h4 style="margin: 0; color: #1976d2;">HTTP Requests</h4>
            <div style="font-size: 24px; font-weight: bold; color: #1976d2;">{{ stats.httpRequests }}</div>
          </div>
          <div style="background: #f3e5f5; padding: 15px; border-radius: 5px; text-align: center;">
            <h4 style="margin: 0; color: #7b1fa2;">Auth Attempts</h4>
            <div style="font-size: 24px; font-weight: bold; color: #7b1fa2;">{{ stats.authAttempts }}</div>
          </div>
          <div style="background: #ffebee; padding: 15px; border-radius: 5px; text-align: center;">
            <h4 style="margin: 0; color: #d32f2f;">Errors</h4>
            <div style="font-size: 24px; font-weight: bold; color: #d32f2f;">{{ stats.errors }}</div>
          </div>
          <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; text-align: center;">
            <h4 style="margin: 0; color: #388e3c;">Success</h4>
            <div style="font-size: 24px; font-weight: bold; color: #388e3c;">{{ stats.success }}</div>
          </div>
        </div>

        <!-- Log entries -->
        <div style="max-height: 600px; overflow-y: auto; border: 1px solid #ddd; border-radius: 5px;">
          <div *ngFor="let log of filteredLogs; trackBy: trackByTimestamp" 
               [style.background]="getLogBackground(log.level)"
               [style.border-left]="'4px solid ' + getLogBorderColor(log.level)"
               style="padding: 12px; border-bottom: 1px solid #eee; font-family: monospace; font-size: 12px;">
            
            <div style="display: flex; justify-content: between; align-items: flex-start; gap: 10px;">
              <div style="flex: 1;">
                <div style="display: flex; gap: 15px; margin-bottom: 5px;">
                  <span [style.color]="getLogTextColor(log.level)" 
                        style="font-weight: bold; min-width: 60px;">
                    {{ log.level }}
                  </span>
                  <span style="color: #666; min-width: 80px;">{{ log.category }}</span>
                  <span style="color: #999; font-size: 11px;">{{ log.timestamp | date:'HH:mm:ss.SSS' }}</span>
                  <span *ngIf="log.requestId" style="color: #007bff; font-size: 11px;">
                    🔗 {{ log.requestId }}
                  </span>
                </div>
                
                <div style="color: #333; margin-bottom: 8px; font-weight: 500;">
                  {{ log.message }}
                </div>
                
                <div *ngIf="log.data" 
                     style="background: #f8f9fa; padding: 8px; border-radius: 3px; overflow-x: auto;">
                  <pre style="margin: 0; white-space: pre-wrap; font-size: 11px;">{{ formatLogData(log.data) }}</pre>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="filteredLogs.length === 0" 
               style="padding: 40px; text-align: center; color: #666;">
            No logs match the current filters
          </div>
        </div>
        
        <!-- Auto-scroll indicator -->
        <div *ngIf="autoRefresh" 
             style="margin-top: 10px; padding: 8px; background: #d4edda; border-radius: 4px; text-align: center; color: #155724;">
          🔄 Auto-refreshing every 2 seconds
        </div>
      </div>
    </div>
  `
})
export class LogViewerComponent implements OnInit, OnDestroy {
  private logger = inject(LoggerService);
  
  filteredLogs: LogEntry[] = [];
  totalLogs = 0;
  autoRefresh = true;
  selectedLevel = '';
  selectedCategory = '';
  
  stats = {
    httpRequests: 0,
    authAttempts: 0,
    errors: 0,
    success: 0
  };

  private refreshSubscription?: Subscription;

  ngOnInit() {
    this.logger.info('LogViewer', 'Log viewer component initialized');
    this.refreshLogs();
    
    if (this.autoRefresh) {
      this.startAutoRefresh();
    }
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  toggleAutoRefresh() {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  private startAutoRefresh() {
    this.refreshSubscription = interval(2000).subscribe(() => {
      this.refreshLogs();
    });
  }

  private stopAutoRefresh() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  refreshLogs() {
    const allLogs = this.logger.getAllLogs();
    this.totalLogs = allLogs.length;
    this.calculateStats(allLogs);
    this.filterLogs();
  }

  filterLogs() {
    let logs = this.logger.getAllLogs();
    
    if (this.selectedLevel) {
      logs = logs.filter(log => log.level === this.selectedLevel);
    }
    
    if (this.selectedCategory) {
      logs = logs.filter(log => log.category === this.selectedCategory);
    }
    
    // Show most recent first
    this.filteredLogs = logs.reverse().slice(0, 100);
  }

  private calculateStats(logs: LogEntry[]) {
    this.stats = {
      httpRequests: logs.filter(log => log.category === 'HTTP_REQUEST').length,
      authAttempts: logs.filter(log => log.category === 'AUTH_ATTEMPT').length,
      errors: logs.filter(log => log.level === 'ERROR').length,
      success: logs.filter(log => log.category === 'AUTH_SUCCESS').length
    };
  }

  clearLogs() {
    this.logger.clearLogs();
    this.refreshLogs();
  }

  exportLogs() {
    const logsJson = this.logger.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `xerpia-logs-${new Date().toISOString().slice(0, 19)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getLogBackground(level: string): string {
    const backgrounds = {
      'ERROR': '#ffebee',
      'WARN': '#fff3e0',
      'INFO': '#e3f2fd',
      'DEBUG': '#f5f5f5',
      'TRACE': '#fafafa'
    };
    return backgrounds[level as keyof typeof backgrounds] || '#ffffff';
  }

  getLogBorderColor(level: string): string {
    const colors = {
      'ERROR': '#f44336',
      'WARN': '#ff9800',
      'INFO': '#2196f3',
      'DEBUG': '#9e9e9e',
      'TRACE': '#e0e0e0'
    };
    return colors[level as keyof typeof colors] || '#e0e0e0';
  }

  getLogTextColor(level: string): string {
    const colors = {
      'ERROR': '#d32f2f',
      'WARN': '#f57c00',
      'INFO': '#1976d2',
      'DEBUG': '#616161',
      'TRACE': '#9e9e9e'
    };
    return colors[level as keyof typeof colors] || '#000000';
  }

  formatLogData(data: any): string {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data, null, 2);
  }

  trackByTimestamp(index: number, log: LogEntry): string {
    return log.timestamp;
  }
}

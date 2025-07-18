import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="background: #2196F3; color: white; padding: 15px; margin-bottom: 20px;">
      <h1 style="margin: 0; display: inline-block;">🏢 Xerpia ERP</h1>
      <nav style="display: inline-block; margin-left: 30px;">
        <a routerLink="/login" style="color: white; margin-right: 20px; text-decoration: none;">🔐 Login</a>
        <a routerLink="/logs" style="color: white; margin-right: 20px; text-decoration: none;">📊 Logs</a>
        <a routerLink="/proxy-test" style="color: white; margin-right: 20px; text-decoration: none;">🧪 Proxy Test</a>
        <a routerLink="/dashboard" style="color: white; margin-right: 20px; text-decoration: none;">📈 Dashboard</a>
      </nav>
    </div>
  `
})
export class NavigationComponent {}

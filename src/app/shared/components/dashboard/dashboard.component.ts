import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  appName = 'Xerpia ERP';
  currentUser: User | null = null;
  showDebug = false;
  debugInfo: any = {};

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.updateDebugInfo();
    
    console.log('🏠 Dashboard loaded for user:', this.currentUser);
  }

  hasAccess(requiredRoles: string[]): boolean {
    return this.authService.hasAnyRole(requiredRoles);
  }

  logout(): void {
    console.log('👋 User logging out...');
    this.authService.logout();
  }

  toggleDebug() {
    this.showDebug = !this.showDebug;
    if (this.showDebug) {
      this.updateDebugInfo();
    }
  }

  private updateDebugInfo() {
    this.debugInfo = {
      user: this.currentUser,
      token: this.authService.getToken()?.substring(0, 50) + '...',
      tokenPayload: this.authService.getTokenPayload(),
      isAuthenticated: this.authService.isAuthenticated(),
      timestamp: new Date().toISOString()
    };
  }
}

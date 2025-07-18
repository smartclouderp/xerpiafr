import { Routes } from '@angular/router';
import { RoleGuard } from '../../../core/guards/role.guard';

export const accountingRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./accounting-dashboard/accounting-dashboard.component').then(c => c.AccountingDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager', 'accountant'] }
      },
      {
        path: 'reports',
        loadComponent: () => import('./accounting-reports/accounting-reports.component').then(c => c.AccountingReportsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager', 'accountant'] }
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

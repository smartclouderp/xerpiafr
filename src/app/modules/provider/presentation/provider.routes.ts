import { Routes } from '@angular/router';
import { RoleGuard } from '../../../core/guards/role.guard';

export const providerRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        loadComponent: () => import('./provider-list/provider-list.component').then(c => c.ProviderListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager', 'user'] }
      },
      {
        path: 'form',
        loadComponent: () => import('./provider-form/provider-form.component').then(c => c.ProviderFormComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager'] }
      },
      {
        path: 'form/:id',
        loadComponent: () => import('./provider-form/provider-form.component').then(c => c.ProviderFormComponent),
        canActivate: [RoleGuard],
        data: { roles: ['admin', 'manager'] }
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      }
    ]
  }
];

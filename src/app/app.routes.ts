import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'logs',
    loadComponent: () => import('./shared/components/log-viewer/log-viewer.component').then(m => m.LogViewerComponent)
  },
  {
    path: 'proxy-test',
    loadComponent: () => import('./proxy-test.component').then(m => m.ProxyTestComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./modules/user/presentation/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'debug-login',
    loadComponent: () => import('./shared/components/debug-login/debug-login.component').then(m => m.DebugLoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/user/presentation/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./shared/components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/user/presentation/user.routes').then(m => m.userRoutes),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['admin', 'manager'] }
  },
  {
    path: 'products',
    loadChildren: () => import('./modules/product/presentation/product.routes').then(m => m.productRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'providers',
    loadChildren: () => import('./modules/provider/presentation/provider.routes').then(m => m.providerRoutes),
    canActivate: [AuthGuard]
  },
  {
    path: 'accounting',
    loadChildren: () => import('./modules/accounting/presentation/accounting.routes').then(m => m.accountingRoutes),
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRoles: ['admin', 'manager'] }
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./shared/components/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

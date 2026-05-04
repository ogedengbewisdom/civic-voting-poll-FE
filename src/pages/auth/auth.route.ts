import { Routes } from '@angular/router';
import { AuthLayout } from '../../layouts/auth-layout/auth-layout';

export const AUTH_ROUTE: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', loadComponent: () => import('./login/login').then((m) => m.Login) },
      {
        path: 'register',
        loadComponent: () => import('./register/register').then((m) => m.Register),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
      {
        path: 'reset-password/:token',
        loadComponent: () => import('./reset-password/reset-password').then((m) => m.ResetPassword),
      },
    ],
  },
];

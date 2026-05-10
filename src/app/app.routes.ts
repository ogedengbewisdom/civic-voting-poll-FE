import { Routes } from '@angular/router';
import { MainLayout } from '../layouts/main-layout/main-layout';
import { NotFound } from '../pages/not-found/not-found';
import { authGuard } from '../pages/auth/guard/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('../pages/auth/auth.route').then((m) => m.AUTH_ROUTE),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('../pages/protected/protected.routes').then((m) => m.PROTECTED_ROUTES),
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('../pages/home/home').then((m) => m.Home),
      },
      {
        path: 'about',
        loadComponent: () => import('../pages/about/about').then((m) => m.About),
        canActivate: [authGuard],
      },
      {
        path: '**',
        // loadComponent: () => import('../pages/not-found/not-found').then((m) => m.NotFound),
        component: NotFound,
      },
    ],
  },
];

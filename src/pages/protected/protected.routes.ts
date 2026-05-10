import { Routes } from '@angular/router';
import { ShellLayout } from '../../layouts/shell-layout/shell-layout';
import { authGuard } from '../auth/guard/auth-guard';

export const PROTECTED_ROUTES: Routes = [
  {
    path: '',
    component: ShellLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      },
      { path: 'profile', loadComponent: () => import('./profile/profile').then((m) => m.Profile) },
      { path: 'polls', loadComponent: () => import('./polls/polls').then((m) => m.Polls) },
      {
        path: 'polls/:id',
        loadComponent: () => import('./poll-detail/poll-detail').then((m) => m.PollDetail),
      },
    ],
  },
];

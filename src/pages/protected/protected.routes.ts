import { Routes } from '@angular/router';
import { ShellLayout } from '../../layouts/shell-layout/shell-layout';
import { authGuard } from '../auth/guard/auth-guard';
import { roleGuard } from '../auth/guard/role-guard';

export const PROTECTED_ROUTES: Routes = [
  {
    path: '',
    component: ShellLayout,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'polls', pathMatch: 'full' },
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
      // },
      { path: 'profile', loadComponent: () => import('./profile/profile').then((m) => m.Profile) },
      {
        canActivate: [roleGuard],
        path: 'manage-polls',
        loadComponent: () => import('./manage-polls/manage-polls').then((m) => m.ManagePolls),
      },
      {
        canActivate: [roleGuard],
        path: 'manage-users',
        loadComponent: () => import('./manage-users/manage-users').then((m) => m.ManageUsers),
      },
      { path: 'polls', loadComponent: () => import('./polls/polls').then((m) => m.Polls) },
      {
        path: 'polls/:poll_id',
        loadComponent: () => import('./poll-detail/poll-detail').then((m) => m.PollDetail),
      },
      {
        path: 'result/:poll_id',
        loadComponent: () => import('./poll-result/poll-result').then((m) => m.PollResult),
      },
    ],
  },
];

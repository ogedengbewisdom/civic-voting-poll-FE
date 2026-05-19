import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Button } from '../../shared/components/button/button';
import { AuthService } from '../../pages/auth/service/auth-service';
import { LogoutModal } from '../../pages/auth/logout-modal/logout-modal';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';

@Component({
  selector: 'app-shell-layout',
  imports: [
    CommonModule,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    Button,
    LogoutModal,
    TruncatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell-layout.html',
  styleUrl: './shell-layout.css',
})
export class ShellLayout implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  isMenuOpen: boolean = false;
  showLogoutModal$ = this.authService.showLogoutModal$;
  profile$ = this.authService.profile$;
  isAdmin = 'admin';
  protected navLinks = [
    // { label: 'Dashboard', routerLink: '/app/dashboard', exact: true },
    { label: 'Polls', routerLink: '/app/polls', exact: true },
    { label: 'Profile', routerLink: '/app/profile', exact: false },
  ];
  protected adminPanelLinks = [
    { label: 'Manage poll', routerLink: '/app/manage-polls', exact: true },
    // { label: 'manage users', routerLink: '/app/manage-users', exact: false },
  ];

  ngOnInit(): void {
    // console.log(this.userData);
    // this.authService.refreshProfile();
  }
  navigateHome(): void {
    this.router.navigateByUrl('/');
  }

  logout(): void {
    this.authService.toggleLogoutModal();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}

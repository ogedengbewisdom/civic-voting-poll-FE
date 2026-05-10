import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../button/button';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../../../pages/auth/service/auth-service';
import { LogoutModal } from '../../../pages/auth/logout-modal/logout-modal';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, CommonModule, Button, LogoutModal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  private router = inject(Router);
  private menuOpened$ = new BehaviorSubject<boolean>(false);
  private authService = inject(AuthService);
  isLoggedIn$ = this.authService.isLoggedIn$;
  showLogoutModal$ = this.authService.showLogoutModal$;

  menuOpened: boolean = false;

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  toggleModal() {
    this.authService.toggleLogoutModal();
  }

  navigateToLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}

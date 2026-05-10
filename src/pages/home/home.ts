import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
// import { NavBar } from './nav-bar/nav-bar';
import { Button } from '../../shared/components/button/button';
import { AuthService } from '../auth/service/auth-service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Button, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  private rouer = inject(Router);
  private authService = inject(AuthService);
  isLoggedIn$ = this.authService.isLoggedIn$;

  navigateToRegister(): void {
    this.rouer.navigateByUrl('/auth/register');
  }

  navigateToPoll(): void {
    this.rouer.navigateByUrl('/app/polls');
  }
}

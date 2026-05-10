import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Modal } from '../../../shared/components/modal/modal';
import { AuthService } from '../service/auth-service';
import { Button } from '../../../shared/components/button/button';

@Component({
  selector: 'app-logout-modal',
  imports: [CommonModule, Modal, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './logout-modal.html',
  styleUrl: './logout-modal.css',
})
export class LogoutModal implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  toggleModal(): void {
    this.authService.toggleLogoutModal();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnInit(): void {
    // this.authService.resetToggleState();
  }

  ngOnDestroy(): void {
    this.authService.resetToggleState();
  }
}

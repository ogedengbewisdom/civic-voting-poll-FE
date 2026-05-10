import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Toast } from '../shared/components/toast/toast';
import { AuthService } from '../pages/auth/service/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('civic-voting-poll');
  private authService = inject(AuthService);
  user: any = null;

  ngOnInit() {
    if (this.authService.handleExpiredToken()) {
      this.user = this.authService.getUserData();
    }
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from '../button/button';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, CommonModule, Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar {
  private menuOpened$ = new BehaviorSubject<boolean>(false);
  menuOpened = this.menuOpened$.asObservable();

  toggleMenu() {
    this.menuOpened$.next(!this.menuOpened$.value);
  }
}

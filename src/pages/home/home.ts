import { ChangeDetectionStrategy, Component } from '@angular/core';
// import { NavBar } from './nav-bar/nav-bar';
import { Button } from '../../shared/components/button/button';

@Component({
  selector: 'app-home',
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

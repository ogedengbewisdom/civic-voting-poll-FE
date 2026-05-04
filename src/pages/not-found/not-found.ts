import { Component, inject } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [Button],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  // constructor(private router: Router) {}
  goHome() {
    this.router.navigate(['/']);
    // console.log('goHome');
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}

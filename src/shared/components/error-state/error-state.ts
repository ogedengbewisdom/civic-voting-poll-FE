import { Location } from '@angular/common';
import { Component, inject, Input } from '@angular/core';

@Component({
  selector: 'app-error-state',
  imports: [],
  templateUrl: './error-state.html',
  styleUrl: './error-state.css',
})
export class ErrorState {
  private location = inject(Location);
  @Input() statusCode: number = 500;
  @Input() errorMessage: string =
    "We couldn't load the polls. Please try again or contact support if the problem persists.";
  // @Output() retry = new EventEmitter<void>();

  goBack(): void {
    this.location.back();
  }
}

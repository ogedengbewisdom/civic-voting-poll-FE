import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './password-input.html',
  styleUrl: './password-input.css',
})
export class PasswordInput {
  @Input() formGroup!: FormGroup;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() errorMessage: string = '';
  @Input() type: 'password' | 'text' = 'password';
  @Input() hasError: boolean = false;
  @Input() showPassword: boolean = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.type = this.showPassword ? 'text' : 'password';
  }
}

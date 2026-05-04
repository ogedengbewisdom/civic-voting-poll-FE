import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { errorState, getErrorMessage, trimValidator } from '../../../shared/utils';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, TextInput, ReactiveFormsModule, Button, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  forgotPasswordForm!: FormGroup;
  token = this.route.snapshot.params['token'];
  buildForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [trimValidator, Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.buildForm();
  }

  get controls() {
    return this.forgotPasswordForm.controls;
  }

  errorMessage = (formInputName: string) => getErrorMessage(formInputName, this.controls);

  hasError = (formInputName: string) => errorState(formInputName, this.controls);

  submitForm() {
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    console.log(this.forgotPasswordForm.value);

    this.forgotPasswordForm.reset();
    this.router.navigate(['/auth/reset-password/token']);
  }
}

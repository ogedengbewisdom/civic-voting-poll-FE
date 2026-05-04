import { Component, inject, OnInit } from '@angular/core';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import {
  errorState,
  getErrorMessage,
  passwordMatchValidator,
  trimValidator,
} from '../../../shared/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [PasswordInput, CommonModule, ReactiveFormsModule, Button],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  resetPasswordForm!: FormGroup;

  buildForm() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: ['', [trimValidator, Validators.required, Validators.minLength(8)]],
        confirmNewPassword: [''],
      },
      {
        validators: [passwordMatchValidator('newPassword', 'confirmNewPassword')],
      },
    );
  }

  ngOnInit(): void {
    this.buildForm();
  }

  get controls() {
    return this.resetPasswordForm.controls;
  }

  errorMessage = (formInputName: string) => getErrorMessage(formInputName, this.controls);

  hasError = (formInputName: string) => errorState(formInputName, this.controls);

  submitForm() {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    console.log(this.resetPasswordForm.value);

    this.resetPasswordForm.reset();
    this.router.navigate(['/auth/login']);
  }
}

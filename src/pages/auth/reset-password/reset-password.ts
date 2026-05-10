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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { ToastService } from '../../../shared/components/toast/service/toast-service';
import { BehaviorSubject, tap } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  imports: [PasswordInput, CommonModule, ReactiveFormsModule, Button, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword implements OnInit {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private activatedRoute = inject(ActivatedRoute);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  resetPasswordForm!: FormGroup;
  token!: string;

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
    this.token = this.activatedRoute.snapshot.paramMap.get('token') ?? '';
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

    const { newPassword, confirmNewPassword } = this.resetPasswordForm.value;

    const data = {
      password: newPassword,
      confirm_password: confirmNewPassword,
    };

    this.authService
      .resetPassword(data, this.token)
      .pipe(
        tap(() => {
          this.toastService.pending('Logging in...');
          this.loadingSubject.next(true);
        }),
      )
      .subscribe({
        next: (response) => {
          this.toastService.success(response.message, response.statusCode);
          this.loadingSubject.next(false);
          this.resetPasswordForm.reset();
          this.router.navigateByUrl('/auth/login');
        },
        error: (error) => {
          const error_message = error.error.message || 'An unknown error occurred';
          const status_code = error.error.statusCode || 500;
          this.toastService.error(error_message, status_code);
          this.loadingSubject.next(false);
        },
      });
  }
}

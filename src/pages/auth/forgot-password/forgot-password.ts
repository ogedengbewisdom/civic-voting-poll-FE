import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { errorState, getErrorMessage, trimValidator } from '../../../shared/utils';
import { AuthService } from '../service/auth-service';
import { ToastService } from '../../../shared/components/toast/service/toast-service';
import { BehaviorSubject, tap } from 'rxjs';
import { email } from '@angular/forms/signals';

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
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
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

    // console.log(this.forgotPasswordForm.value);
    // const data = { email: this.forgotPasswordForm.value.email };
    const data = this.forgotPasswordForm.value.email;

    this.authService
      .forgotPassword(data)
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
          this.forgotPasswordForm.reset();
          this.router.navigateByUrl('/');
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

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { Button } from '../../../shared/components/button/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { errorState, getErrorMessage, trimValidator } from '../../../shared/utils';
import { AuthService } from '../service/auth-service';
import { BehaviorSubject, distinctUntilChanged, finalize, tap } from 'rxjs';
import { ToastService } from '../../../shared/components/toast/service/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  imports: [CommonModule, TextInput, ReactiveFormsModule, PasswordInput, Button, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef$ = inject(DestroyRef);
  redirectUrl: string = '/app/polls';
  loading$ = this.loadingSubject.asObservable();
  loginForm!: FormGroup;

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [trimValidator, Validators.required, Validators.email]],
      password: ['', [trimValidator, Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.activatedRoute.queryParams
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef$))
      .subscribe((params) => {
        this.redirectUrl = params['redirectUrl'] || '/app/polls';
      });
  }

  get controls() {
    return this.loginForm.controls;
  }

  errorMessage = (formInputName: string) => getErrorMessage(formInputName, this.controls);

  hasError = (formInputName: string) => errorState(formInputName, this.controls);

  submitForm() {
    if (this.loginForm.invalid) {
      return;
    }

    this.toastService.pending('Logging in...');
    this.loadingSubject.next(true);

    this.authService
      .login(this.loginForm.value)

      .subscribe({
        next: (response) => {
          this.authService.refreshProfile(response.data);
          this.authService.setLoggedIn(true);
          this.authService.timerLogout();
          this.toastService.success(response.message, response.statusCode);
          this.loadingSubject.next(false);
          this.loginForm.reset();
          this.router.navigateByUrl(this.redirectUrl);
        },
        error: (error) => {
          const error_message = error.error.message || 'An unknown error occurred';
          const status_code = error.error.statusCode || 500;
          this.toastService.error(error_message, status_code);
          this.loadingSubject.next(false);
        },
      });
  }

  ngOnDestroy() {
    this.toastService.clearToast();
  }
}

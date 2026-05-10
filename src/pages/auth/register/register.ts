import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { Button } from '../../../shared/components/button/button';
import { Router, RouterLink } from '@angular/router';
import {
  errorState,
  getErrorMessage,
  passwordMatchValidator,
  trimValidator,
} from '../../../shared/utils';
import { IOption, SelectInput } from '../../../shared/components/select-input/select-input';
import { StateService } from '../../../shared/service/state-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../service/auth-service';
import { ToastService } from '../../../shared/components/toast/service/toast-service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    TextInput,
    ReactiveFormsModule,
    PasswordInput,
    Button,
    RouterLink,
    SelectInput,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private stateService = inject(StateService);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private toastService = inject(ToastService);
  private router = inject(Router);
  loading$ = this.loadingSubject.asObservable();
  state$!: Observable<IOption[]>;
  registerForm!: FormGroup;

  buildForm() {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', [trimValidator, Validators.required]],
        lastName: ['', [trimValidator, Validators.required]],
        email: ['', [trimValidator, Validators.required, Validators.email]],
        password: ['', [trimValidator, Validators.required, Validators.minLength(8)]],
        confirmPassword: [''],
        state: ['', [trimValidator, Validators.required]],
      },
      {
        validators: [passwordMatchValidator()],
      },
    );
  }

  ngOnInit(): void {
    this.buildForm();
    this.state$ = this.stateService.getStates();
  }

  get controls() {
    return this.registerForm.controls;
  }

  errorMessage = (formInputName: string) => getErrorMessage(formInputName, this.controls);

  hasError = (formInputName: string) => errorState(formInputName, this.controls);

  submitForm() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loadingSubject.next(true);

    const { firstName, lastName, password, state, email } = this.registerForm.value;

    const data = {
      first_name: firstName,
      last_name: lastName,
      password,
      state_id: Number(state),
      email,
    };

    this.authService.register(data).subscribe({
      next: (response) => {
        this.toastService.success(response.message, response.statusCode);
        this.loadingSubject.next(false);
        this.router.navigateByUrl('/auth/login');
        this.registerForm.reset();
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

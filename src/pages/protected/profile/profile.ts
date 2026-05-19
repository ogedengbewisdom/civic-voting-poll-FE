import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../shared/components/button/button';
import { IOption, SelectInput } from '../../../shared/components/select-input/select-input';
import { errorState, getErrorMessage, trimValidator } from '../../../shared/utils';
import { StateService } from '../../../shared/service/state-service';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth-service';
import { ToastService } from '../../../shared/components/toast/service/toast-service';
import { IUpdateUser } from '../../auth/interface';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, TextInput, ReactiveFormsModule, Button, SelectInput],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private formBuilder = inject(FormBuilder);
  private stateService = inject(StateService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  profile$ = this.authService.profile$;
  state$!: Observable<IOption[]>;
  userData = this.authService.getUserData();
  profileForm!: FormGroup;
  loading: boolean = false;

  buildForm() {
    this.profileForm = this.formBuilder.group({
      firstName: [this.userData?.first_name, [trimValidator, Validators.required]],
      lastName: [this.userData?.last_name, [trimValidator, Validators.required]],
      email: [{ value: this.userData?.email, disabled: true }],
      state: [this.userData?.state_id.toString(), [trimValidator, Validators.required]],
    });
  }

  ngOnInit(): void {
    this.buildForm();
    this.state$ = this.stateService.getStates();
  }

  get controls() {
    return this.profileForm.controls;
  }

  errorMessage = (formInputName: string) => getErrorMessage(formInputName, this.controls);

  hasError = (formInputName: string) => errorState(formInputName, this.controls);

  submitForm() {
    if (this.profileForm.invalid) return;

    this.toastService.pending('Logging in...');
    this.loading = true;

    const { firstName, lastName, state } = this.profileForm.value;

    const userData: IUpdateUser = {
      first_name: firstName,
      last_name: lastName,
      state_id: Number(state),
    };

    this.authService.updateUser(userData).subscribe({
      next: (response) => {
        this.authService.refreshProfile(response.data);
        this.toastService.success(response.message, response.statusCode);
        this.loading = false;
      },
      error: (error) => {
        const error_message = error.error.message || 'An unknown error occurred';
        const status_code = error.error.statusCode || 500;
        this.toastService.error(error_message, status_code);
        this.loading = false;
      },
    });
  }
}

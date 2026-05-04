import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { Button } from '../../../shared/components/button/button';
import { RouterLink } from '@angular/router';
import {
  errorState,
  getErrorMessage,
  passwordMatchValidator,
  trimValidator,
} from '../../../shared/utils';
import { SelectInput } from '../../../shared/components/select-input/select-input';

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
  registerForm!: FormGroup;
  stateOptions = [
    { value: 'CA', label: 'California' },
    { value: 'NY', label: 'New York' },
    { value: 'TX', label: 'Texas' },
    { value: 'FL', label: 'Florida' },
    { value: 'IL', label: 'Illinois' },
    { value: 'MI', label: 'Michigan' },
  ];

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
    console.log(this.registerForm.value);

    this.registerForm.reset();
  }
}

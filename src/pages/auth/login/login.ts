import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { TextInput } from '../../../shared/components/text-input/text-input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordInput } from '../../../shared/components/password-input/password-input';
import { Button } from '../../../shared/components/button/button';
import { RouterLink } from '@angular/router';
import { errorState, getErrorMessage, trimValidator } from '../../../shared/utils';

@Component({
  selector: 'app-login',
  imports: [CommonModule, TextInput, ReactiveFormsModule, PasswordInput, Button, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;

  buildForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [trimValidator, Validators.required, Validators.email]],
      password: ['', [trimValidator, Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.buildForm();
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
    console.log(this.loginForm.value);

    this.loginForm.reset();
  }
}

import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginFormFields } from 'src/app/enums';

@Injectable()
export class LoginFormService {
      private readonly formBuilder: FormBuilder;
      private readonly loginForm: FormGroup;

      public constructor() {
            this.formBuilder = inject(FormBuilder);
            this.loginForm = this.formBuilder.group({
                  [LoginFormFields.EMAIL]: this.emailForm,
                  [LoginFormFields.PASSWORD]: this.passwordForm,
            });
      }

      private get emailForm() {
            return new FormControl(null, {
                  validators: [Validators.required, Validators.maxLength(255), Validators.email],
            });
      }

      private get passwordForm() {
            return new FormControl(null, {
                  validators: [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.maxLength(255),
                        this.atLeastANumber,
                        this.atLeastASpecialCharacter,
                        this.atLeastAnUpperCaseLetter,
                  ],
            });
      }

      private get atLeastANumber() {
            return function (control: AbstractControl) {
                  const value = control.value as string;
                  return /\d/.test(value) ? null : { atLeastANumber: true };
            };
      }

      public get atLeastAnUpperCaseLetter() {
            return function (control: AbstractControl) {
                  const value = control.value as string;
                  return /[A-Z]/.test(value) ? null : { atLeastAnUpperCaseLetter: true };
            };
      }

      public get atLeastASpecialCharacter() {
            return function (control: AbstractControl) {
                  const value = control.value as string;
                  return /[!@#$%^&*]/.test(value) ? null : { atLeastASpecialCharacter: true };
            };
      }

      public get form() {
            return this.loginForm;
      }

      public get emailField() {
            return LoginFormFields.EMAIL;
      }

      public get passwordField() {
            return LoginFormFields.PASSWORD;
      }

      public get emailControl() {
            return this.loginForm.get(LoginFormFields.EMAIL);
      }

      public get passwordControl() {
            return this.loginForm.get(LoginFormFields.PASSWORD);
      }
}

import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginFormFields } from 'src/app/enums';
import { LoginValidators } from 'src/app/validators';

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
                  validators: [LoginValidators.required, LoginValidators.maxLength(255), LoginValidators.email],
            });
      }

      private get passwordForm() {
            return new FormControl(null, {
                  validators: [
                        LoginValidators.required,
                        LoginValidators.minLength(8),
                        LoginValidators.maxLength(255),
                        LoginValidators.atLeastANumber,
                        LoginValidators.atLeastASpecialCharacter,
                        LoginValidators.atLeastAnUpperCaseLetter,
                  ],
            });
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

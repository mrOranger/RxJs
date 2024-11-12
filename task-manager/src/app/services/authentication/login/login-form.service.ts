import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginFormFields } from 'src/app/enums';

@Injectable({ providedIn: 'root' })
export class LoginFormService {
      private readonly formBuilder: FormBuilder;
      private readonly loginForm: FormGroup;

      public constructor() {
            this.formBuilder = inject(FormBuilder);
            this.loginForm = this.formBuilder.group({
                  [LoginFormFields.EMAIL]: [null, [Validators.required, Validators.maxLength(255), Validators.email]],
                  [LoginFormFields.PASSWORD]: [
                        null,
                        [
                              Validators.required,
                              Validators.pattern(
                                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&_])[A-Za-z\d$@$!%*?&_]{8,20}$/,
                              ),
                        ],
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

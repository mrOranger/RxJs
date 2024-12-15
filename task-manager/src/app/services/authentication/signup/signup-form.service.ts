import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SignupFormFields } from 'src/app/enums';

@Injectable()
export class SignupFormService {
      private readonly signupForm: FormGroup;
      private readonly formBuilder: FormBuilder;

      public constructor() {
            this.formBuilder = inject(FormBuilder);

            this.signupForm = this.formBuilder.group({
                  [SignupFormFields.FIRST_NAME]: this.firstNameForm,
                  [SignupFormFields.LAST_NAME]: this.lastNameForm,
                  [SignupFormFields.EMAIL]: this.emailForm,
                  [SignupFormFields.PASSWORD]: this.passwordForm,
                  [SignupFormFields.CONFIRM_PASSWORD]: this.confirmPasswordForm,
            });
      }

      private get firstNameForm() {
            return new FormControl('', {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }

      private get lastNameForm() {
            return new FormControl('', {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }

      private get emailForm() {
            return new FormControl('', {
                  validators: [Validators.required, Validators.maxLength(255), Validators.email],
            });
      }

      private get passwordForm() {
            return new FormControl('', {
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

      private get confirmPasswordForm() {
            return new FormControl('', {
                  validators: [Validators.required, this.matching],
            });
      }

      private get atLeastANumber() {
            return (control: AbstractControl) => {
                  const value = control.value as string;
                  return /\d/.test(value) ? null : { atLeastANumber: true };
            };
      }

      public get atLeastAnUpperCaseLetter() {
            return (control: AbstractControl) => {
                  const value = control.value as string;
                  return /[A-Z]/.test(value) ? null : { atLeastAnUpperCaseLetter: true };
            };
      }

      public get atLeastASpecialCharacter() {
            return (control: AbstractControl) => {
                  const value = control.value as string;
                  return /[!@#$%^&*]/.test(value) ? null : { atLeastASpecialCharacter: true };
            };
      }

      public get matching() {
            return (control: AbstractControl) => {
                  const currentPassword = control.value as string;
                  const prevPassword = this.passwordForm.value as string;
                  return currentPassword !== prevPassword ? { matching: false } : null;
            };
      }

      public get firstNameControl() {
            return this.signupForm.get(SignupFormFields.FIRST_NAME);
      }

      public get lastNameControl() {
            return this.signupForm.get(SignupFormFields.LAST_NAME);
      }

      public get emailControl() {
            return this.signupForm.get(SignupFormFields.EMAIL);
      }

      public get passwordControl() {
            return this.signupForm.get(SignupFormFields.PASSWORD);
      }

      public get confirmPasswordControl() {
            return this.signupForm.get(SignupFormFields.CONFIRM_PASSWORD);
      }
}

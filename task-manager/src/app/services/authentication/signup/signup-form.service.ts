import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { SignupFormFields } from 'src/app/enums';
import { UserService } from '../../database';
import { catchError, filter, of, switchMap } from 'rxjs';

@Injectable()
export class SignupFormService {
      private readonly signupForm: FormGroup;
      private readonly formBuilder: FormBuilder;
      private readonly userService: UserService;

      public readonly passwordFormGroupName = 'passwords_group';

      public constructor() {
            this.userService = inject(UserService)

            this.formBuilder = inject(FormBuilder);

            this.signupForm = this.formBuilder.group({
                  [SignupFormFields.FIRST_NAME]: this.firstNameForm,
                  [SignupFormFields.LAST_NAME]: this.lastNameForm,
                  [SignupFormFields.EMAIL]: this.emailForm,
                  [this.passwordFormGroupName]: this.passwordsForm,
            });
      }

      public get form() {
            return this.signupForm;
      }

      public get firstNameField() {
            return SignupFormFields.FIRST_NAME;
      }

      public get lastNameField() {
            return SignupFormFields.LAST_NAME;
      }

      public get emailField() {
            return SignupFormFields.EMAIL;
      }

      public get passwordField() {
            return SignupFormFields.PASSWORD;
      }

      public get confirmPasswordField() {
            return SignupFormFields.CONFIRM_PASSWORD;
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
                  asyncValidators: [this.uniqueEmail$],
            });
      }

      private get passwordsForm() {
            return new FormGroup(
                  {
                        [SignupFormFields.PASSWORD]: this.passwordForm,
                        [SignupFormFields.CONFIRM_PASSWORD]: this.confirmPasswordForm,
                  },
                  {
                        validators: [this.matching],
                  },
            );
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

      private get uniqueEmail$() {
            return (control: AbstractControl) => {
                  return this.userService.findByEmail(control.value).pipe(
                        catchError(() => of(null)),
                        switchMap((user) => {
                              if (!user) {
                                    return of(null);
                              }
                              return of({ unique: true });
                        }),
                  );
            };
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
                  const password = control.get(SignupFormFields.PASSWORD)?.value;
                  const confirm = control.get(SignupFormFields.CONFIRM_PASSWORD)?.value;
                  return password === confirm ? null : { matching: true };
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

      public get passwordsGroupControl() {
            return this.signupForm.get(this.passwordFormGroupName);
      }

      public get passwordControl() {
            return this.signupForm
                  .get(this.passwordFormGroupName)
                  ?.get(SignupFormFields.PASSWORD);
      }

      public get confirmPasswordControl() {
            return this.signupForm
                  .get(this.passwordFormGroupName)
                  ?.get(SignupFormFields.CONFIRM_PASSWORD);
      }
}

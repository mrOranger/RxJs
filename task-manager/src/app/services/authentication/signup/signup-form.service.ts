import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { catchError, of, switchMap } from 'rxjs';

import { UserService } from '../../database';
import { SignupFormFields } from 'src/app/enums';
import { SignupValidators } from 'src/app/validators';

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
                  validators: [SignupValidators.required, SignupValidators.minLength(2), SignupValidators.maxLength(255)],
            });
      }

      private get lastNameForm() {
            return new FormControl('', {
                  validators: [SignupValidators.required, SignupValidators.minLength(2), SignupValidators.maxLength(255)],
            });
      }

      private get emailForm() {
            return new FormControl('', {
                  validators: [SignupValidators.required, SignupValidators.maxLength(255), SignupValidators.email],
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
                        validators: [SignupValidators.matching],
                  },
            );
      }

      private get passwordForm() {
            return new FormControl('', {
                  validators: [
                        SignupValidators.required,
                        SignupValidators.minLength(8),
                        SignupValidators.maxLength(255),
                        SignupValidators.atLeastANumber,
                        SignupValidators.atLeastASpecialCharacter,
                        SignupValidators.atLeastAnUpperCaseLetter,
                  ],
            });
      }

      private get confirmPasswordForm() {
            return new FormControl('', {
                  validators: [
                        SignupValidators.required,
                        SignupValidators.minLength(8),
                        SignupValidators.maxLength(255),
                        SignupValidators.atLeastANumber,
                        SignupValidators.atLeastASpecialCharacter,
                        SignupValidators.atLeastAnUpperCaseLetter,
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

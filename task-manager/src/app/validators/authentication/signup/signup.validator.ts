import { AbstractControl, Validators } from '@angular/forms';

import { SignupFormFields } from 'src/app/enums';

export class SignupValidators extends Validators {

      public static atLeastANumber() {
            return (control: AbstractControl) => {
                  const value = control.value as string;
                  return /\d/.test(value) ? null : { atLeastANumber: true };
            };
      }

      public static atLeastAnUpperCaseLetter() {
            return (control: AbstractControl) => {
                  const value = control.value as string;
                  return /[A-Z]/.test(value) ? null : { atLeastAnUpperCaseLetter: true };
            };
      }

      public static atLeastASpecialCharacter() {
            return (control: AbstractControl) => {
                  const value = control.value as string;
                  return /[!@#$%^&*]/.test(value) ? null : { atLeastASpecialCharacter: true };
            };
      }

      public static matching() {
            return (control: AbstractControl) => {
                  const password = control.get(SignupFormFields.PASSWORD)?.value;
                  const confirm = control.get(SignupFormFields.CONFIRM_PASSWORD)?.value;
                  return password === confirm ? null : { matching: true };
            };
      }
}

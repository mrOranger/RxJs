import { AbstractControl, Validators } from '@angular/forms';

export class LoginValidators extends Validators {
      public static atLeastANumber() {
            return function (control: AbstractControl) {
                  const value = control.value as string;
                  return /\d/.test(value) ? null : { atLeastANumber: true };
            };
      }

      public static atLeastAnUpperCaseLetter() {
            return function (control: AbstractControl) {
                  const value = control.value as string;
                  return /[A-Z]/.test(value) ? null : { atLeastAnUpperCaseLetter: true };
            };
      }

      public static atLeastASpecialCharacter() {
            return function (control: AbstractControl) {
                  const value = control.value as string;
                  return /[!@#$%^&*]/.test(value) ? null : { atLeastASpecialCharacter: true };
            };
      }
}

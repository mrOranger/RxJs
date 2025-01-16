import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export class ProjectFormValidators extends Validators {
      public static get notBeforeToday(): ValidatorFn {
            return (control: AbstractControl) => {
                  return Date.parse(control.value) < Date.now() ? { notBeforeToday: true } : null;
            };
      }

      public static get notBeforeStartingDate(): ValidatorFn {
            return (control: AbstractControl) => {
                  const { starting_date, ending_date } = control?.value;
                  return Date.parse(starting_date) > Date.parse(ending_date) ? { notBeforeStartingDate: true } : null;
            };
      }
}

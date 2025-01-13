import { AbstractControl, Validators } from '@angular/forms';

export class ProjectFormValidators extends Validators {
      public static get notBeforeToday() {
            return (control: AbstractControl) => {
                  const value = new Date(control.value);
                  return value?.getTime() > Date.now() ? null : { notBeforeToday: true };
            };
      }

      public static get notBeforeStartingDate() {
            return (control: AbstractControl) => {
                  const startingDate = new Date(control.get('starting_date')?.value);
                  const endingDate = new Date(control.get('ending_date')?.value);
                  return startingDate?.getTime() <= endingDate?.getTime() ? null : { notBeforeStartingDate: true };
            };
      }
}

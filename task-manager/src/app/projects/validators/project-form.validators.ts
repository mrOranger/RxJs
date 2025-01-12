import { AbstractControl, Validators } from '@angular/forms';

export class ProjectFormValidators extends Validators {
      public static get notBeforeToday() {
            return (control: AbstractControl) => {
                  const value = control.value as Date;
                  return value?.getTime() > Date.now() ? null : { notBeforeToday: true };
            };
      }
}

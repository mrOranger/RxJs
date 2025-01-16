import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PartialObserver } from 'rxjs';

import { ProjectFormValidators } from '../validators';

@Injectable()
export class ProjectFormService {
      private readonly projectForm: FormGroup;

      public constructor() {
            this.projectForm = new FormGroup({
                  [this.titleFormName]: new FormControl('', {
                        validators: [Validators.required, Validators.maxLength(255)],
                  }),
                  [this.descriptionFormName]: new FormControl('', {
                        validators: [Validators.required, Validators.maxLength(255)],
                  }),
                  [this.dateFormName]: new FormGroup(
                        {
                              [this.startingDateFormName]: new FormControl(null, {
                                    validators: [Validators.required, ProjectFormValidators.notBeforeToday],
                              }),
                              [this.endingDateFormName]: new FormControl(null, { validators: [Validators.required] }),
                        },
                        {
                              validators: [ProjectFormValidators.notBeforeStartingDate],
                        },
                  ),
            });
      }

      public get form() {
            return this.projectForm;
      }

      public get titleFormName() {
            return 'title';
      }

      public get descriptionFormName() {
            return 'description';
      }

      public get dateFormName() {
            return 'date';
      }

      public get startingDateFormName() {
            return 'starting_date';
      }

      public get endingDateFormName() {
            return 'ending_date';
      }

      public get titleFormControl() {
            return this.form.controls[this.titleFormName];
      }

      public get descriptionFormControl() {
            return this.form.controls[this.descriptionFormName];
      }

      public get dateFormControl() {
            return this.form.controls[this.dateFormName];
      }

      public get startingDateFormControl() {
            return this.form.get(this.dateFormName)?.get(this.startingDateFormName);
      }

      public get endingDateFormControl() {
            return this.form.get(this.dateFormName)?.get(this.endingDateFormName);
      }

      public subscribeOnValueChanges(
            observer: PartialObserver<{ title: string; description: string; starting_date: Date; ending_date: Date }>,
      ) {
            return this.projectForm.valueChanges.subscribe(observer);
      }

      public set data(formValues: { title: string; description: string; startingDate: Date; endingDate: Date }) {
            this.projectForm.controls[this.titleFormName].patchValue(formValues.title);
            this.projectForm.controls[this.descriptionFormName].patchValue(formValues.description);
            this.projectForm.controls[this.startingDateFormName].patchValue(formValues.startingDate);
            this.projectForm.controls[this.endingDateFormName].patchValue(formValues.endingDate);
            this.projectForm.updateValueAndValidity();
      }
}

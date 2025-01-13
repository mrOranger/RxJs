import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PartialObserver } from 'rxjs';

import { ProjectFormValidators } from '../validators';

@Injectable()
export class ProjectFormService {
      private readonly projectForm: FormGroup;

      public constructor() {
            this.projectForm = new FormGroup(
                  {
                        [this.titleFormName]: new FormControl('', [Validators.required, Validators.maxLength(255)]),
                        [this.descriptionFormName]: new FormControl('', [
                              Validators.required,
                              Validators.maxLength(255),
                        ]),
                        [this.startingDateFormName]: new FormControl(null, [
                              Validators.required,
                              ProjectFormValidators.notBeforeToday,
                        ]),
                        [this.endingDateFormName]: new FormControl(null, [Validators.required]),
                  },
                  {
                        validators: [ProjectFormValidators.notBeforeStartingDate],
                  },
            );
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

      public get startingDateFormControl() {
            return this.form.controls[this.startingDateFormName];
      }

      public get endingDateFormControl() {
            return this.form.controls[this.endingDateFormName];
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

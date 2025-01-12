import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PartialObserver } from 'rxjs';

import { ProjectFormValidators } from '../validators';

@Injectable()
export class ProjectFormService {
      private readonly projectForm: FormGroup;
      private readonly formBuilder: FormBuilder;

      public constructor() {
            this.formBuilder = inject(FormBuilder);

            this.projectForm = this.formBuilder.group({
                  [this.titleFormName]: ['', [Validators.required, Validators.maxLength(255)]],
                  [this.descriptionFormName]: ['', [Validators.required, Validators.maxLength(255)]],
                  [this.startingDateFormName]: [null, [Validators.required, ProjectFormValidators.notBeforeToday]],
                  [this.endingDateFormName]: [null, [Validators.required]],
            });
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

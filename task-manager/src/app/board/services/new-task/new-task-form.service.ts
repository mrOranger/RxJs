import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class NewTaskFormService {

      private readonly newTaskForm: FormGroup;
      private readonly formBuilder: FormBuilder;

      public constructor() {
            this.formBuilder = inject(FormBuilder);

            this.newTaskForm = this.formBuilder.group({
                  [this.titleFormName]: this.titleFormControl,
                  [this.descriptionFormName]: this.descriptionFormControl,
            });
      }

      public get titleFormName() {
            return 'title';
      }

      public get titleFormControl() {
            return new FormControl('', {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }

      public get descriptionFormName() {
            return 'description';
      }

      public get descriptionFormControl() {
            return new FormControl('', {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }

      public get form() {
            return this.newTaskForm;
      }
}

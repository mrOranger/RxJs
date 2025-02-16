import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { User } from 'src/app/shared';

@Injectable()
export class TaskFormService {
      private readonly newTaskForm: FormGroup;
      private readonly formBuilder: FormBuilder;

      public constructor() {
            this.formBuilder = inject(FormBuilder);

            this.newTaskForm = this.formBuilder.group({
                  [this.titleFormName]: new FormControl('', {
                        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
                  }),
                  [this.descriptionFormName]: new FormControl('', {
                        validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
                  }),
                  [this.assignedUserFormName]: new FormControl<User | null>(null, {
                        validators: [Validators.required],
                  }),
            });
      }

      public get form() {
            return this.newTaskForm;
      }

      public get titleFormControl() {
            return this.newTaskForm.controls[this.titleFormName] as FormControl;
      }

      public get descriptionFormControl() {
            return this.newTaskForm.controls[this.descriptionFormName] as FormControl;
      }

      public get assignedUserFormControl() {
            return this.newTaskForm.controls[this.assignedUserFormName] as FormControl;
      }

      public get titleFormName() {
            return 'title';
      }

      public get descriptionFormName() {
            return 'description';
      }

      public get assignedUserFormName() {
            return 'assigned_user';
      }
}

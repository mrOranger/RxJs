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
            return <FormControl>this.newTaskForm.controls[this.titleFormName];
      }

      public get descriptionFormControl() {
            return <FormControl>this.newTaskForm.controls[this.descriptionFormName];
      }

      public get assignedUserFormControl() {
            return <FormControl>this.newTaskForm.controls[this.assignedUserFormName];
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

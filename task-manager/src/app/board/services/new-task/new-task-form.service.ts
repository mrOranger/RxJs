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
                  [this.assignedUserFormName]: this.assignedUserFormControl,
            });
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

      public get titleFormControl() {
            return new FormControl('', {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }

      public get descriptionFormControl() {
            return new FormControl('', {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }

      public get assignedUserFormControl() {
            return new FormControl('', {
                  validators: [Validators.required],
            });
      }

      public get form() {
            return this.newTaskForm;
      }

      public get title() {
            return this.titleFormControl.value as string;
      }

      public get description() {
            return this.descriptionFormControl.value as string;
      }

      public get assignedUser() {
            return this.assignedUserFormControl.value as string;
      }
}

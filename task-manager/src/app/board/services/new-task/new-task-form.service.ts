import { inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable()
export class NewTaskFormService {

      private readonly form: FormGroup;
      private readonly formBuilder: FormBuilder;

      public constructor() {
            this.formBuilder = inject(FormBuilder);
            this.form = this.formBuilder.group({
                  [this.titleFormName]: this.titleForm,
                  [this.descriptionFormName]: this.descriptionForm,
            });
      }

      public get titleFormName() {
            return 'title';
      }

      public get titleForm() {
            return new FormControl(null, {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }

      public get descriptionFormName() {
            return 'description';
      }

      public get descriptionForm() {
            return new FormControl(null, {
                  validators: [Validators.required, Validators.minLength(2), Validators.maxLength(255)],
            });
      }
}

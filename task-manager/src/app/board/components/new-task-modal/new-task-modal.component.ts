import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { NewTaskFormService, NewTaskStoreService } from '../../services';
import { InputComponent, ModalService } from 'src/app/shared';

@Component({
      standalone: true,
      selector: 'tm-new-task-modal',
      templateUrl: './new-task-modal.component.html',
      styleUrls: ['./new-task-modal.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [NewTaskFormService],
      imports: [FormsModule, ReactiveFormsModule, InputComponent],
})
export class NewTaskModalComponent implements OnInit, OnDestroy {

      private readonly modalService: ModalService;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly newTaskFormService: NewTaskFormService;
      private readonly newTaskStoreService: NewTaskStoreService;

      private newTaskFormService$?: Subscription;

      public constructor() {
            this.modalService = inject(ModalService);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.newTaskFormService = inject(NewTaskFormService);
            this.newTaskStoreService = inject(NewTaskStoreService);
      }

      public ngOnInit(): void {
            this.newTaskFormService$ = this.newTaskFormService.form.valueChanges.subscribe({
                  next: (values) => {
                        this.modalService.updateConfig({ okDisabled: !this.newTaskFormService.form.valid, cancelDisabled: false });
                        this.changeDetectorRef.detectChanges();
                  }
            });
      }

      public get form() {
            return this.newTaskFormService.form;
      }

      public get formService() {
            return this.newTaskFormService;
      }

      public ngOnDestroy(): void {
            this.newTaskFormService$?.unsubscribe();
      }

}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import * as moment from 'moment';

import { Task, User, UserRepository, UserService } from 'src/app/shared';
import { USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      imports: [CommonModule],
      selector: 'tm-task-list-item',
      templateUrl: './task-list-item.component.html',
      styleUrls: ['./task-list-item.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{ provide: USER_REPOSITORY_TOKEN, useClass: UserService }]
})
export class TaskListItemComponent implements OnInit, OnDestroy {

      @Input() public task!: Task;

      private users?: User[];
      private users$?: Subscription;
      private changeDetectorRef: ChangeDetectorRef;

      public constructor(
            @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository,
      ) {
            this.changeDetectorRef = inject(ChangeDetectorRef);
      }

      public ngOnInit(): void {
            this.users$ = this.userRepository.index().subscribe({
                  next: (users) => {
                        this.users = users;
                        this.changeDetectorRef.detectChanges();
                  }
            });
      }

      public get createdAt() {
            return moment(this.task.createdAt).format('ddd, DD/MM/YYYY');
      }

      public get updatedAt() {
            return moment(this.task.updatedAt).format('ddd, DD/MM/YYYY');
      }

      public get taskUsers() {
            return this.users ?? [];
      }

      public ngOnDestroy(): void {
            this.users$?.unsubscribe();
      }
}

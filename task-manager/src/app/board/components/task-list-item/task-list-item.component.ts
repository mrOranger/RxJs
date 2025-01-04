import {
      ChangeDetectionStrategy,
      ChangeDetectorRef,
      Component,
      ElementRef,
      inject,
      Input,
      OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import * as moment from 'moment';

import {
      DatabaseService,
      StoreTaskService,
      Task,
      TaskUser,
      TaskUserRepository,
      TaskUserService,
      User,
      UserRepository,
      UserService,
} from 'src/app/shared';
import { TASK_USER_REPOSITORY_TOKEN, USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { forkJoin } from 'rxjs';

@Component({
      standalone: true,
      imports: [CommonModule],
      selector: 'tm-task-list-item',
      templateUrl: './task-list-item.component.html',
      styleUrls: ['./task-list-item.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
            draggable: 'true',
            '(dragstart)': 'onDragStart($event)',
            '(dragend)': 'onDragEnd($event)',
      },
      providers: [
            DatabaseService,
            StoreTaskService,
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            { provide: TASK_USER_REPOSITORY_TOKEN, useClass: TaskUserService },
      ],
})
export class TaskListItemComponent implements OnInit {
      @Input() public task!: Task;

      private users: User[];
      private isHidden: boolean;
      private assignations: TaskUser[];
      private readonly elementRef: ElementRef;
      private readonly userRepository: UserRepository;
      private readonly changeDetectorRef: ChangeDetectorRef;
      private readonly taskUserRepository: TaskUserRepository;

      public constructor() {
            this.users = [];
            this.isHidden = false;
            this.assignations = [];
            this.elementRef = inject(ElementRef);
            this.changeDetectorRef = inject(ChangeDetectorRef);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
            this.taskUserRepository = inject<TaskUserRepository>(TASK_USER_REPOSITORY_TOKEN);
      }

      public ngOnInit(): void {
            forkJoin([this.userRepository.index(), this.taskUserRepository.index()]).subscribe({
                  next: ([users, assignations]) => {
                        this.users = users;
                        this.assignations = assignations;
                        this.changeDetectorRef.detectChanges();
                  },
            });
      }

      public get assignedUsers() {
            return (
                  this.assignations
                        .filter((anAssignation) => anAssignation.taskId === this.task.id)
                        .map((anAssignation) => this.users.find((aUser) => aUser.id === anAssignation.userId)) ?? []
            );
      }

      public get createdAt() {
            return moment(this.task.createdAt).format('ddd, DD/MM/YYYY');
      }

      public get updatedAt() {
            return moment(this.task.updatedAt).format('ddd, DD/MM/YYYY');
      }

      public get hidden() {
            return this.isHidden;
      }

      public onDragStart(event: DragEvent) {
            console.log(this.task.id, 'dragstart', this.elementRef);
      }

      public onDragEnd(event: DragEvent) {
            console.log(this.task.id, 'dragend', this.elementRef);
      }
}

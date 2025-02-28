import { inject, Injectable } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { from, Observable, of, switchMap, throwError } from 'rxjs';

import { Task } from '../../../models';
import { TaskRepository } from './task.repository';
import { TaskStatus } from '../../../enums';
import { DatabaseService } from '../database.service';

@Injectable()
export class TaskService implements TaskRepository {
      private readonly databaseService: DatabaseService;

      public constructor() {
            this.databaseService = inject(DatabaseService);
      }

      public index(): Observable<Task[]> {
            return from(this.databaseService.tasks.toArray());
      }

      public find(key: string): Observable<Task> {
            return from(this.databaseService.tasks.where('id').equalsIgnoreCase(key).first()).pipe(
                  switchMap((result) => {
                        if (result) {
                              return of(result);
                        }
                        return throwError(() => 'Task not found');
                  }),
            );
      }

      public findByProjectId(projectId: string): Observable<Task[]> {
            return from(this.databaseService.tasks.where('projectId').equalsIgnoreCase(projectId).toArray());
      }

      public save(value: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
            const newTask = {
                  id: uuidv4(),
                  ...value,
                  status: TaskStatus.TODO,
                  createdAt: new Date(),
                  updatedAt: new Date(),
            };
            return from(this.databaseService.tasks.add(newTask)).pipe(switchMap(() => of(newTask)));
      }

      public update(key: string, value: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Observable<Task> {
            const updatedTask = { ...value, createdAt: new Date(), updatedAt: new Date() };
            return from(this.databaseService.tasks.update(key, updatedTask)).pipe(
                  switchMap((updatedTasks) => {
                        if (updatedTasks > 0) {
                              return of({ id: key, ...updatedTask });
                        }
                        return throwError(() => 'Task not found');
                  }),
            );
      }
      public delete(key: string): Observable<void> {
            return from(this.databaseService.tasks.delete(key));
      }
}

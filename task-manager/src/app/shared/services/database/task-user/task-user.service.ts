import { inject, Injectable } from '@angular/core';

import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

import { TaskUserRepository } from './task-user.repository';

import { TaskUser } from '../../../models';
import { DatabaseService } from '../database.service';

@Injectable()
export class TaskUserService implements TaskUserRepository {

      private readonly databaseService: DatabaseService;

      public constructor() {
            this.databaseService = inject(DatabaseService);
      }

      public find(userId: string, taskId: string): Observable<TaskUser> {
            return from(
                  this.databaseService.taskUser
                        .where({
                              userId: userId,
                              taskId: taskId,
                        })
                        .first(),
            ).pipe(
                  switchMap((result) => {
                        if (result) {
                              return of(result);
                        }
                        return throwError(() => 'Relationship not found');
                  }),
            );
      }

      public attach(userId: string, taskId: string): Observable<TaskUser> {
            const newEntity: TaskUser = {
                  id: uuidv4(),
                  taskId: taskId,
                  userId: userId,
                  updatedAt: new Date(),
                  createdAt: new Date(),
            };

            return from(this.find(userId, taskId)).pipe(
                  catchError(() => this.databaseService.taskUser.add(newEntity)),
                  switchMap(() => of(newEntity)),
            );
      }

      public detach(userId: string, taskId: string): Observable<void> {
            return from(this.find(userId, taskId)).pipe(
                  switchMap((relationship) => this.databaseService.taskUser.delete(relationship.id)),
            );
      }
}

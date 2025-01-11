import { inject, Injectable } from '@angular/core';

import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

import { ProjectTaskRepository } from './project-task.repository';
import { DatabaseService } from '../database.service';
import { ProjectTask } from 'src/app/shared/models';

@Injectable()
export class ProjectTaskService implements ProjectTaskRepository {
      private readonly databaseService: DatabaseService;

      public constructor() {
            this.databaseService = inject(DatabaseService);
      }

      public findByProjectIdAndTaskId(projectId: string, taskId: string): Observable<ProjectTask> {
            return from(this.databaseService.projectTask.where({ projectId, taskId }).first()).pipe(
                  switchMap((result) => {
                        if (result) {
                              return of(result);
                        }
                        return throwError(() => 'Relationship not found');
                  }),
            );
      }

      public attach(projectId: string, taskId: string): Observable<ProjectTask> {
            const newEntity: ProjectTask = {
                  id: uuidv4(),
                  projectId: projectId,
                  taskId: taskId,
                  updatedAt: new Date(),
                  createdAt: new Date(),
            };

            return from(this.findByProjectIdAndTaskId(projectId, taskId)).pipe(
                  catchError(() => this.databaseService.projectTask.add(newEntity)),
                  switchMap(() => of(newEntity)),
            );
      }

      public detach(projectId: string, taskId: string): Observable<void> {
            return from(this.findByProjectIdAndTaskId(projectId, taskId)).pipe(
                  switchMap((relationship) => this.databaseService.projectUser.delete(relationship.id)),
            );
      }
}

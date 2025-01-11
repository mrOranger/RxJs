import { inject, Injectable } from '@angular/core';

import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

import { ProjectUserRepository } from './project-user.repository';
import { DatabaseService } from '../database.service';
import { ProjectUser } from 'src/app/shared/models';

@Injectable()
export class ProjectUserService implements ProjectUserRepository {
      private readonly databaseService: DatabaseService;

      public constructor() {
            this.databaseService = inject(DatabaseService);
      }

      public findByProjectIdAndUserId(projectId: string, userId: string): Observable<ProjectUser> {
            return from(this.databaseService.projectUser.where({ projectId, userId }).first()).pipe(
                  switchMap((result) => {
                        if (result) {
                              return of(result);
                        }
                        return throwError(() => 'Relationship not found');
                  }),
            );
      }

      public attach(projectId: string, userId: string): Observable<ProjectUser> {
            const newEntity: ProjectUser = {
                  id: uuidv4(),
                  projectId: projectId,
                  userId: userId,
                  updatedAt: new Date(),
                  createdAt: new Date(),
            };

            return from(this.findByProjectIdAndUserId(projectId, userId)).pipe(
                  catchError(() => this.databaseService.projectUser.add(newEntity)),
                  switchMap(() => of(newEntity)),
            );
      }

      public detach(projectId: string, userId: string): Observable<void> {
            return from(this.findByProjectIdAndUserId(projectId, userId)).pipe(
                  switchMap((relationship) => this.databaseService.projectUser.delete(relationship.id)),
            );
      }
}

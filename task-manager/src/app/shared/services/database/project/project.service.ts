import { inject, Injectable } from '@angular/core';

import { from, Observable, of, switchMap, throwError } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

import { ProjectRepository } from './project.repository';
import { DatabaseService } from '../database.service';
import { Project } from 'src/app/shared/models';

@Injectable()
export class ProjectService implements ProjectRepository {
      private readonly databaseService: DatabaseService;

      public constructor() {
            this.databaseService = inject(DatabaseService);
      }

      public index(): Observable<Project[]> {
            return from(this.databaseService.projects.toArray());
      }

      public find(key: string): Observable<Project> {
            return from(this.databaseService.projects.where({ id: key }).first()).pipe(
                  switchMap((result) => {
                        if (result) {
                              return of(result);
                        }
                        return throwError(() => 'Project not found');
                  }),
            );
      }

      public save(value: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
            const newProject = {
                  id: uuidv4(),
                  ...value,
                  createdAt: new Date(),
                  updatedAt: new Date(),
            };
            return from(this.databaseService.projects.add(newProject)).pipe(switchMap(() => of(newProject)));
      }

      public update(key: string, value: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Observable<Project> {
            const updatedProject = { ...value, createdAt: new Date(), updatedAt: new Date() };
            return from(this.databaseService.projects.update(key, updatedProject)).pipe(
                  switchMap((updatedTasks) => {
                        if (updatedTasks > 0) {
                              return of({ id: key, ...updatedProject });
                        }
                        return throwError(() => 'Project not found');
                  }),
            );
      }

      public delete(key: string): Observable<void> {
            return from(this.databaseService.projects.delete(key));
      }
}

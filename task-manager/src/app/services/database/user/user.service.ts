import { Injectable } from '@angular/core';

import { v4 as uuidv4 } from 'uuid';

import { from, Observable, of, switchMap, throwError } from 'rxjs';

import { User } from 'src/app/models';
import { UserRepository } from './user.repository';
import { DatabaseService } from '../database.service';

@Injectable()
export class UserService implements UserRepository {
      public constructor(private readonly databaseService: DatabaseService) {}

      public index(): Observable<User[]> {
            return from(this.databaseService.users.toArray());
      }

      public find(key: string): Observable<User> {
            return from(this.databaseService.users.where('id').equalsIgnoreCase(key).first()).pipe(
                  switchMap((result) => {
                        if (result) {
                              return of(result);
                        }
                        return throwError(() => 'User not found');
                  }),
            );
      }

      public findByEmailAndPassword(email: string, password: string): Observable<User> {
            return from(this.databaseService.users.where({ email, password }).first()).pipe(
                  switchMap((result) => {
                        if (result) {
                              return of(result);
                        }
                        return throwError(() => 'User not found');
                  }),
            );
      }

      public save(value: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
            const newUser = { id: uuidv4(), ...value, createdAt: new Date(), updatedAt: new Date() };
            return from(this.databaseService.users.add(newUser)).pipe(switchMap(() => of(newUser)));
      }

      public update(key: string, value: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
            const updatedUser = { ...value, createdAt: new Date(), updatedAt: new Date() };
            return from(this.databaseService.users.update(key, updatedUser)).pipe(
                  switchMap((updatedUsers) => {
                        if (updatedUsers > 0) {
                              return of({ id: key, ...updatedUser });
                        }
                        return throwError(() => 'User not found');
                  }),
            );
      }

      public delete(key: string): Observable<void> {
            return from(this.databaseService.users.delete(key));
      }
}

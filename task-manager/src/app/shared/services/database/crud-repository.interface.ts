import { Observable } from 'rxjs';
import { Entity } from '../../models';

export interface CrudRepository<T extends Entity, K, V extends keyof T> {
      index(): Observable<T[]>;
      find(key: K): Observable<T>;
      save(value: Omit<T, V>): Observable<T>;
      update(key: K, value: Omit<T, V>): Observable<T>;
      delete(key: K): Observable<void>;
}

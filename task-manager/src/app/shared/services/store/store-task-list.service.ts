import { Injectable } from '@angular/core';
import { StoreService } from '../store.service';
import { Task } from '../../models';

@Injectable({ providedIn: 'root' })
export class StoreTaskListService extends StoreService<Task[]> {
      public constructor() {
            super([]);
      }

      public add(task: Task): void {
            this.value = [...this.value, task];
      }

      public update(task: Task): void {
            this.value = this.value.map((aTask) => {
                  if (aTask.id === task.id) {
                        return task;
                  }
                  return aTask;
            });
      }

      public delete(task: Task): void {
            this.value = this.value.filter((aTask) => aTask.id === task.id);
      }
}

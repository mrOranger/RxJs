import { Observable } from "rxjs";
import { TaskUser } from "../../../models";

export interface TaskUserRepository {
      index(): Observable<TaskUser[]>;
      find(userId: string, taskId: string): Observable<TaskUser>;
      attach(userId: string, taskId: string): Observable<TaskUser>;
      detach(userId: string, taskId: string): Observable<void>;
}

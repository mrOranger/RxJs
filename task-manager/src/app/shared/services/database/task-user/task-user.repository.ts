import { Observable } from "rxjs";
import { TaskUser } from "../../../models";

export interface TaskUserRepository {
      find(userId: string, taskId: string): Observable<TaskUser>;
      attach(userId: string, taskId: string): Observable<TaskUser>;
      detach(userId: string, taskId: string): Observable<void>;
}

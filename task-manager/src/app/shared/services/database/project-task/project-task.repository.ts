import { Observable } from 'rxjs';
import { ProjectTask } from 'src/app/shared/models';

export interface ProjectTaskRepository {
      findByProjectIdAndTaskId(projectId: string, taskId: string): Observable<ProjectTask>;
      attach(projectId: string, taskId: string): Observable<ProjectTask>;
      detach(projectId: string, taskId: string): Observable<void>;
}

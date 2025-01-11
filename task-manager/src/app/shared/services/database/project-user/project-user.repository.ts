import { Observable } from 'rxjs';
import { ProjectUser } from 'src/app/shared/models';

export interface ProjectUserRepository {
      findByProjectIdAndUserId(projectId: string, userId: string): Observable<ProjectUser>;
      attach(projectId: string, userId: string): Observable<ProjectUser>;
      detach(projectId: string, userId: string): Observable<void>;
}

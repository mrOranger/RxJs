import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListItemComponent } from './project-list-item.component';

describe('ProjectListItemComponent', () => {
      let component: ProjectListItemComponent;
      let fixture: ComponentFixture<ProjectListItemComponent>;

      beforeEach(() => {
            TestBed.configureTestingModule({
                  imports: [ProjectListItemComponent],
            });
            fixture = TestBed.createComponent(ProjectListItemComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
      });

      it('should create', () => {
            expect(component).toBeTruthy();
      });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyProjectListComponent } from './empty-project-list.component';

describe('EmptyProjectListComponent', () => {
      let component: EmptyProjectListComponent;
      let fixture: ComponentFixture<EmptyProjectListComponent>;

      beforeEach(() => {
            TestBed.configureTestingModule({
                  imports: [EmptyProjectListComponent],
            });
            fixture = TestBed.createComponent(EmptyProjectListComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
      });

      it('should create', () => {
            expect(component).toBeTruthy();
      });
});

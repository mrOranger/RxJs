import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProjectModalComponent } from './update-project-modal.component';

describe('UpdateProjectModalComponent', () => {
      let component: UpdateProjectModalComponent;
      let fixture: ComponentFixture<UpdateProjectModalComponent>;

      beforeEach(() => {
            TestBed.configureTestingModule({
                  imports: [UpdateProjectModalComponent],
            });
            fixture = TestBed.createComponent(UpdateProjectModalComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
      });

      it('should create', () => {
            expect(component).toBeTruthy();
      });
});

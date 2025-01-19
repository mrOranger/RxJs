import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoProjectSelectedComponent } from './no-project-selected.component';

describe('NoProjectSelectedComponent', () => {
  let component: NoProjectSelectedComponent;
  let fixture: ComponentFixture<NoProjectSelectedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoProjectSelectedComponent]
    });
    fixture = TestBed.createComponent(NoProjectSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

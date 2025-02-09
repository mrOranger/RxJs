import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonComponent } from './button.component';

describe('button.component', () => {
      beforeEach(() => {
            TestBed.configureTestingModule({
                  declarations: [ButtonComponent],
            });
      });

      it('should create the button', () => {
            const fixture = TestBed.createComponent(ButtonComponent);
            const button = fixture.debugElement.componentInstance;

            expect(button).toBeTruthy();
      });

      it('should create the button with hidden attribute', () => {
            const fixture = TestBed.createComponent(ButtonComponent);
            const button = fixture.debugElement.componentInstance;

            fixture.componentInstance.hidden = true;

            expect(button).toBeTruthy();
            expect(fixture.debugElement.attributes['hidden']).toBeTruthy();
      });

      it('should create the button without hidden attribute', () => {
            const fixture = TestBed.createComponent(ButtonComponent);
            const button = fixture.debugElement.componentInstance;

            fixture.componentInstance.hidden = true;

            expect(button).toBeTruthy();
            expect(fixture.debugElement.attributes['hidden']).toBeFalsy();
      });
});

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { faSign, faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { SignupFormService } from 'src/app/services';

@Component({
      selector: 'app-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [SignupFormService],
})
export class SignupComponent {
      private readonly signupFormService: SignupFormService;

      public constructor() {
            this.signupFormService = inject(SignupFormService);
      }

      public get formService() {
            return this.signupFormService;
      }

      public get applicationIcon() {
            return faTasks;
      }

      public get signUpIcon() {
            return faSignInAlt;
      }

      public onClick() {
            console.log('onClick');
      }
}

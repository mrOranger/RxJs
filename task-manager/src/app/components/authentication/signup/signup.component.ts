import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { NotificationService, SignupFormService, UserService } from 'src/app/services';

@Component({
      selector: 'tm-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupComponent {

      private readonly userService: UserService;
      private readonly signupFormService: SignupFormService;
      private readonly notificationService: NotificationService;

      public constructor() {
            this.userService = inject(UserService);
            this.signupFormService = inject(SignupFormService);
            this.notificationService = inject(NotificationService);
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
            this.userService.save({
                  firstName: this.signupFormService.firstNameControl?.value,
                  lastName: this.signupFormService.lastNameControl?.value,
                  email: this.signupFormService.emailControl?.value,
                  password: this.signupFormService.passwordControl?.value,
            }).subscribe({
                  next: (savedUser) => this.notificationService.success('You have been successfully signed in.', 5000),
                  error: (error) => {
                        console.error(error);
                        this.notificationService.error('An error occurred, please try again later.', 5000);
                  },
            });
      }
}

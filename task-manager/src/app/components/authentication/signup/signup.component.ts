import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { User } from 'src/app/models';
import { SignupFormService, UserService } from 'src/app/services';

@Component({
      selector: 'app-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [SignupFormService],
})
export class SignupComponent {
      private readonly signupFormService: SignupFormService;
      private readonly userService: UserService;

      public constructor() {
            this.userService = inject(UserService);
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
            this.userService.save({
                  firstName: this.signupFormService.firstNameControl?.value,
                  lastName: this.signupFormService.lastNameControl?.value,
                  email: this.signupFormService.emailControl?.value,
                  password: this.signupFormService.passwordControl?.value,
            }).subscribe({
                  next: (savedUser) => {
                        console.log(savedUser);
                  },
                  error: (error) => {
                        console.error(error);
                  },
            });
      }
}

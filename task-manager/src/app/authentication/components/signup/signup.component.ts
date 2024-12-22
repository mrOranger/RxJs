import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { DatabaseService, UserRepository, UserService } from 'src/app/services';
import { SignupFormService, StoreSignupService } from '../../services';
import { ButtonComponent, InputComponent, NotificationService } from 'src/app/shared';
import { USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
      standalone: true,
      selector: 'tm-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [
            NgIf,
            RouterLink,
            FormsModule,
            InputComponent,
            ButtonComponent,
            FontAwesomeModule,
            ReactiveFormsModule,
      ],
      providers: [
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            DatabaseService,
            SignupFormService,
            StoreSignupService,
      ]
})
export class SignupComponent {

      private readonly signupFormService: SignupFormService;
      private readonly notificationService: NotificationService;

      public constructor(
            @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository
      ) {
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
            this.userRepository.save({
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

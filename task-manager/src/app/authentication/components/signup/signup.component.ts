import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

import { v4 as uuid4 } from 'uuid';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import {
      ButtonComponent,
      InputComponent,
      NotificationService,
      DatabaseService,
      UserRepository,
      UserService,
      LoaderService,
      LocalStorageService,
} from 'src/app/shared';
import { SignupFormService, StoreSignupService } from '../../services';
import { USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      standalone: true,
      selector: 'tm-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [NgIf, RouterLink, FormsModule, InputComponent, ButtonComponent, FontAwesomeModule, ReactiveFormsModule],
      providers: [
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            LoaderService,
            DatabaseService,
            SignupFormService,
            StoreSignupService,
            LocalStorageService,
      ],
})
export class SignupComponent {

      private readonly loaderService: LoaderService;
      private readonly signupFormService: SignupFormService;
      private readonly notificationService: NotificationService;
      private readonly localStorageService: LocalStorageService;

      public constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository) {
            this.loaderService = inject(LoaderService);
            this.signupFormService = inject(SignupFormService);
            this.notificationService = inject(NotificationService);
            this.localStorageService = inject(LocalStorageService);
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
            this.loaderService.start('Signing up...');
            this.userRepository
                  .save({
                        firstName: this.signupFormService.firstNameControl?.value,
                        lastName: this.signupFormService.lastNameControl?.value,
                        email: this.signupFormService.emailControl?.value,
                        password: this.signupFormService.passwordControl?.value,
                  })
                  .subscribe({
                        next: () => {
                              this.loaderService.stop();
                              this.localStorageService.authKey = uuid4();
                              this.notificationService.success('You have been successfully signed in.', 5000)
                        },
                        error: (error) => {
                              console.error(error);
                              this.loaderService.stop();
                              this.notificationService.error('An error occurred, please try again later.', 5000);
                        },
                  });
      }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
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
      imports: [
            NgIf,
            RouterLink,
            FormsModule,
            RouterModule,
            InputComponent,
            ButtonComponent,
            FontAwesomeModule,
            ReactiveFormsModule,
      ],
      providers: [
            LoaderService,
            DatabaseService,
            SignupFormService,
            StoreSignupService,
            LocalStorageService,
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
      ],
})
export class SignupComponent {
      private readonly router: Router;
      private readonly loaderService: LoaderService;
      private readonly userRepository: UserRepository;
      private readonly signupFormService: SignupFormService;
      private readonly notificationService: NotificationService;
      private readonly localStorageService: LocalStorageService;

      public constructor() {
            this.router = inject(Router);
            this.loaderService = inject(LoaderService);
            this.signupFormService = inject(SignupFormService);
            this.notificationService = inject(NotificationService);
            this.localStorageService = inject(LocalStorageService);
            this.userRepository = inject<UserRepository>(USER_REPOSITORY_TOKEN);
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
                        next: (user) => {
                              this.localStorageService.authKey = uuid4();
                              this.localStorageService.userId = user.id;
                              this.notificationService.success('You have been successfully signed in.', 5000);
                              this.router.navigate(['/home']);
                              this.loaderService.stop();
                        },
                        error: (error) => {
                              console.error(error);
                              this.loaderService.stop();
                              this.notificationService.error('An error occurred, please try again later.', 5000);
                        },
                  });
      }
}

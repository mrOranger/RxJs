import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { v4 as uuid4 } from 'uuid';

import {
      ButtonComponent,
      InputComponent,
      LoaderService,
      NotificationService,
      DatabaseService,
      UserRepository,
      UserService,
      LocalStorageService,
} from 'src/app/shared';
import { LoginFormService, StoreLoginService } from '../../services';
import { USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { UserType } from '../../enums';

@Component({
      standalone: true,
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [RouterLink, FormsModule, InputComponent, ButtonComponent, FontAwesomeModule, ReactiveFormsModule],
      providers: [
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            DatabaseService,
            LoginFormService,
            StoreLoginService,
            LocalStorageService,
      ],
})
export class LoginComponent {
      private readonly notificationService: NotificationService;
      private readonly localStorageService: LocalStorageService;
      private readonly loginFormService: LoginFormService;
      private readonly loaderService: LoaderService;

      public constructor(@Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository) {
            this.localStorageService = inject(LocalStorageService);
            this.notificationService = inject(NotificationService);
            this.loginFormService = inject(LoginFormService);
            this.loaderService = inject(LoaderService);
      }

      public get formService() {
            return this.loginFormService;
      }

      public get applicationIcon() {
            return faTasks;
      }

      public get signInIcon() {
            return faSignInAlt;
      }

      public get regularUserType() {
            return UserType.REGULAR_USER;
      }

      public get enterpriseUserType() {
            return UserType.ENTERPRISE_USER;
      }

      public onClick() {
            this.loaderService.start('Loading ...');
            const email = this.loginFormService.emailControl?.value;
            const password = this.loginFormService.passwordControl?.value;
            this.userRepository.findByEmailAndPassword(email, password).subscribe({
                  next: () => {
                        this.loaderService.stop();
                        this.localStorageService.authKey = uuid4();
                        this.notificationService.success('Login successful', 50000);
                  },
                  error: (error) => {
                        console.error(error);
                        this.loaderService.stop();
                        this.notificationService.error('Username or password incorrect', 50000);
                  },
            });
      }
}

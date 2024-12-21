import { ChangeDetectionStrategy, Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { UserRepository } from 'src/app/services';
import { LoginFormService } from '../../services';
import { UserType } from '../../enums';
import { LoaderService, NotificationService } from 'src/app/shared';
import { USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';

@Component({
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit, OnDestroy {
      private readonly notificationService: NotificationService;
      private readonly loginFormService: LoginFormService;
      private readonly loaderService: LoaderService;

      public constructor(
            @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository
      ) {
            this.notificationService = inject(NotificationService);
            this.loginFormService = inject(LoginFormService);
            this.loaderService = inject(LoaderService);
      }

      public ngOnInit(): void {}

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
                  next: (user) => {
                        console.log(user);
                        this.loaderService.stop();
                        this.notificationService.success('Login successful', 5000);
                  },
                  error: (error) => {
                        console.error(error);
                        this.loaderService.stop();
                        this.notificationService.error('Username or password incorrect', 5000);
                  },
            });
      }

      public ngOnDestroy(): void {}
}

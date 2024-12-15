import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { UserType } from 'src/app/enums';
import { LoaderService, LoginFormService, NotificationService, UserService } from 'src/app/services';

@Component({
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
      private readonly notificationService: NotificationService;
      private readonly loginFormService: LoginFormService;
      private readonly loaderService: LoaderService;
      private readonly userService: UserService;

      public constructor() {
            this.notificationService = inject(NotificationService);
            this.loginFormService = inject(LoginFormService);
            this.loaderService = inject(LoaderService);
            this.userService = inject(UserService);
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
            this.userService.findByEmailAndPassword(email, password).subscribe({
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

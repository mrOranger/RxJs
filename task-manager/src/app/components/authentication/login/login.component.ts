import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { UserType } from 'src/app/enums';
import { LoginFormService, UserService } from 'src/app/services';

@Component({
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
      private readonly loginFormService: LoginFormService;
      private readonly userService: UserService;

      public constructor() {
            this.userService = inject(UserService);
            this.loginFormService = inject(LoginFormService);
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
            const email = this.loginFormService.emailControl?.value;
            const password = this.loginFormService.passwordControl?.value;
            this.userService.findByEmailAndPassword(email, password).subscribe({
                  next: (user) => console.log(user),
                  error: (error) => console.error(error),
            });
      }

      public ngOnDestroy(): void {}
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

import { UserType } from 'src/app/enums';
import { LoginFormService } from 'src/app/services';
import { DatabaseService } from 'src/app/services/database/database.service';
import { UserCollectionService } from 'src/app/services/database/user-collection.service';

@Component({
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
      private readonly loginFormService: LoginFormService;
      private readonly userCollectionService: UserCollectionService;

      public constructor() {
            this.userCollectionService = inject(UserCollectionService);
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
            this.userCollectionService
                  .addNewUser({
                        firstName: 'Edoardo',
                        lastName: 'Gentile',
                        email: 'edoardo.gentile@example.com',
                        password: 'Edoardo123',
                  })
                  .subscribe({
                        next: (result) => console.log(result),
                  });
      }

      public ngOnDestroy(): void {}
}

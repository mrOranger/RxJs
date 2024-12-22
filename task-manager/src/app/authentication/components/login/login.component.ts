import { ChangeDetectionStrategy, Component, Inject, inject, OnDestroy, OnInit } from '@angular/core';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { DatabaseService, UserRepository, UserService } from 'src/app/services';
import { LoginFormService, StoreLoginService } from '../../services';
import { UserType } from '../../enums';
import { ButtonComponent, InputComponent, LoaderService, NotificationService } from 'src/app/shared';
import { USER_REPOSITORY_TOKEN } from 'src/app/injection-tokens';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
      standalone: true,
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [
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
            LoginFormService,
            StoreLoginService,
      ]
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

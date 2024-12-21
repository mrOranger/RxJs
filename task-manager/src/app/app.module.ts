import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

import { routes } from './app.routes';
import { LoginComponent, SignupComponent } from './authentication/components';
import { ButtonComponent, InputComponent, LoaderComponent, NotificationComponent, RadioButtonComponent, RadioGroupComponent } from './shared';
import { DatabaseService, UserService } from './services';
import { LoginFormService, SignupFormService, StoreLoginService, StoreSignupService } from './authentication/services';
import { USER_REPOSITORY_TOKEN } from './injection-tokens';


@NgModule({
      declarations: [
            AppComponent,
            LoginComponent,
            SignupComponent,
            LoaderComponent,
            NotificationComponent,
      ],
      imports: [
            RouterModule.forRoot(routes),
            FormsModule,
            BrowserModule,
            InputComponent,
            ButtonComponent,
            FontAwesomeModule,
            ReactiveFormsModule,
            RadioGroupComponent,
            RadioButtonComponent,
      ],
      providers: [
            { provide: USER_REPOSITORY_TOKEN, useClass: UserService },
            UserService,
            DatabaseService,
            LoginFormService,
            SignupFormService,
            StoreLoginService,
            StoreSignupService,
      ],
      bootstrap: [AppComponent],
})
export class AppModule {}

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';

import { UserTypeDirective } from './directives';

import {
      InputComponent,
      LoginComponent,
      LoaderComponent,
      ButtonComponent,
      RadioGroupComponent,
      NotificationComponent,
      RadioButtonComponent,
} from './components';

import {
      StoreLoginFactoryService,
      StorePasswordService,
      StoreEmailService,
      LoginFormService,
      UserService,
      DatabaseService,
      SignupFormService,
} from './services';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { SignupComponent } from './components/authentication/signup/signup.component';

@NgModule({
      declarations: [
            AppComponent,
            LoginComponent,
            UserTypeDirective,
            LoaderComponent,
            NotificationComponent,
            SignupComponent,
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
            UserService,
            DatabaseService,
            LoginFormService,
            StoreEmailService,
            SignupFormService,
            StorePasswordService,
            StoreLoginFactoryService,
      ],
      bootstrap: [AppComponent],
})
export class AppModule {}

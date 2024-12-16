import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

import { routes } from './app.routes';

import {
      InputComponent,
      LoginComponent,
      LoaderComponent,
      ButtonComponent,
      RadioGroupComponent,
      NotificationComponent,
      RadioButtonComponent,
      SignupComponent,
} from './components';

import {
      LoginFormService,
      UserService,
      DatabaseService,
      SignupFormService,
      StoreLoginService,
      StoreSignupService,
} from './services';


@NgModule({
      declarations: [
            AppComponent,
            LoginComponent,
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
            SignupFormService,
            StoreLoginService,
            StoreSignupService,
      ],
      bootstrap: [AppComponent],
})
export class AppModule {}

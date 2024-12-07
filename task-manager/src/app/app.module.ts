import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';

import { UserTypeDirective } from './directives';

import {
      ButtonComponent,
      InputComponent,
      LoginComponent,
      RadioGroupComponent,
      RadioButtonComponent,
} from './components';

import {
      StoreLoginFactoryService,
      StorePasswordService,
      StoreEmailService,
      LoginFormService,
      UserService,
      DatabaseService,
} from './services';

@NgModule({
      declarations: [AppComponent, LoginComponent, UserTypeDirective, RadioButtonComponent],
      imports: [
            FormsModule,
            BrowserModule,
            InputComponent,
            ButtonComponent,
            FontAwesomeModule,
            ReactiveFormsModule,
            RadioGroupComponent,
      ],
      providers: [
            UserService,
            DatabaseService,
            LoginFormService,
            StoreEmailService,
            StorePasswordService,
            StoreLoginFactoryService,
      ],
      bootstrap: [AppComponent],
})
export class AppModule {}

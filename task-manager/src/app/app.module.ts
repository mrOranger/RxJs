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

import { StoreLoginFactoryService, StorePasswordService, StoreEmailService, LoginFormService } from './services';

@NgModule({
      declarations: [AppComponent, LoginComponent, UserTypeDirective, RadioButtonComponent],
      imports: [
            FontAwesomeModule,
            BrowserModule,
            FormsModule,
            InputComponent,
            RadioGroupComponent,
            ButtonComponent,
            ReactiveFormsModule,
      ],
      providers: [StoreLoginFactoryService, StoreEmailService, StorePasswordService, LoginFormService],
      bootstrap: [AppComponent],
})
export class AppModule {}

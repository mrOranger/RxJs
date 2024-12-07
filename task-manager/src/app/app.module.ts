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
import { DatabaseService } from './services/database/database.service';
import { UserCollectionService } from './services/database/user-collection.service';

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
      providers: [
            StoreLoginFactoryService,
            StoreEmailService,
            StorePasswordService,
            LoginFormService,
            DatabaseService,
            UserCollectionService,
      ],
      bootstrap: [AppComponent],
})
export class AppModule {}

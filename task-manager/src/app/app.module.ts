import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { UserTypeDirective } from './directives';
import { ButtonComponent, InputComponent, LoginComponent, RadioGroupComponent } from './components';
import { StoreLoginFactoryService, StorePasswordService, StoreEmailService } from './services';

@NgModule({
      declarations: [AppComponent, LoginComponent, UserTypeDirective],
      imports: [FontAwesomeModule, BrowserModule, FormsModule, InputComponent, RadioGroupComponent, ButtonComponent],
      providers: [StoreLoginFactoryService, StoreEmailService, StorePasswordService],
      bootstrap: [AppComponent],
})
export class AppModule {}

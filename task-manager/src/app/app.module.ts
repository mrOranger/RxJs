import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { LoginComponent } from './components';
import { ButtonComponent, InputComponent } from './components/shared';
import { StoreLoginFactoryService, StorePasswordService, StoreEmailService } from './services';

@NgModule({
      declarations: [AppComponent, LoginComponent],
      imports: [FontAwesomeModule, BrowserModule, FormsModule, ButtonComponent, InputComponent],
      providers: [StoreLoginFactoryService, StoreEmailService, StorePasswordService],
      bootstrap: [AppComponent],
})
export class AppModule {}

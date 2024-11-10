import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './components';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonComponent, InputComponent } from './components/shared';

@NgModule({
      declarations: [AppComponent, LoginComponent],
      imports: [FontAwesomeModule, BrowserModule, ButtonComponent, InputComponent],
      providers: [],
      bootstrap: [AppComponent],
})
export class AppModule {}

import { Component } from '@angular/core';
import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

@Component({
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
})
export class LoginComponent {
      public get applicationIcon() {
            return faTasks;
      }

      public get signInIcon() {
            return faSignInAlt;
      }
}

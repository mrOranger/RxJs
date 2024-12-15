import { Component } from '@angular/core';
import { faSign, faTasks } from '@fortawesome/free-solid-svg-icons';

@Component({
      selector: 'app-signup',
      templateUrl: './signup.component.html',
      styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
      public get applicationIcon() {
            return faTasks;
      }

      public get signUpIcon() {
            return faSign;
      }
}

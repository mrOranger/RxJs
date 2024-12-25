import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faDoorOpen, faHome, faList } from '@fortawesome/free-solid-svg-icons';

@Component({
      standalone: true,
      selector: 'tm-header',
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css'],
      imports: [CommonModule, FontAwesomeModule],
})
export class HeaderComponent {

      public get homeIcon() {
            return faHome;
      }

      public get projectIcon() {
            return faList;
      }

      public get statisticsIcon() {
            return faChartBar;
      }

      public get logoutIcon() {
            return faDoorOpen;
      }

}

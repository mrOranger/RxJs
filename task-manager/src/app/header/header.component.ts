import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChartBar, faDoorOpen, faHome, faList } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

@Component({
      standalone: true,
      selector: 'tm-header',
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css'],
      imports: [CommonModule, FontAwesomeModule, RouterLink],
})
export class HeaderComponent {

      private activeElement: boolean;

      @ViewChild('hamburger')
      public readonly hamburgerMenu!: HTMLUListElement;

      public constructor() {
            this.activeElement = false;
      }

      public get active() {
            return this.activeElement;
      }

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

      public get appIcon() {
            return this.projectIcon;
      }

      public onToggleHamburgerMenu() {
            this.activeElement = !this.activeElement;
      }

}

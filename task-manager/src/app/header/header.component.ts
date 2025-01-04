import { Router, RouterLink, RouterModule } from '@angular/router';
import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { faChartBar, faDoorOpen, faHome, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LoaderService, LocalStorageService } from '../shared';

@Component({
      standalone: true,
      selector: 'tm-header',
      templateUrl: './header.component.html',
      styleUrls: ['./header.component.css'],
      imports: [CommonModule, FontAwesomeModule, RouterLink, RouterModule],
      providers: [LocalStorageService, LoaderService],
})
export class HeaderComponent {

      private activeElement: boolean;
      private readonly router: Router;
      private readonly loaderService: LoaderService;
      private readonly localStorageService: LocalStorageService;

      @ViewChild('hamburger')
      public readonly hamburgerMenu!: HTMLUListElement;

      public constructor() {
            this.activeElement = false;
            this.router = inject(Router);
            this.loaderService = inject(LoaderService);
            this.localStorageService = inject(LocalStorageService);
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

      public onLogout() {
            this.loaderService.startAndStop(() => {
                  this.localStorageService.removeAuthKey();
                  this.router.navigate(['authentication/login']);
            });
      }

}

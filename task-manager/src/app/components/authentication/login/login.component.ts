import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { faSignInAlt, faTasks } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs';

import { StoreLoginFactoryService } from 'src/app/services';

@Component({
      selector: 'tm-login',
      templateUrl: './login.component.html',
      styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
      private readonly storeLoginFactoryService: StoreLoginFactoryService;

      private userEmail: string;
      private userPassword: string;

      private email$?: Subscription;
      private password$?: Subscription;

      public constructor() {
            this.storeLoginFactoryService = inject(StoreLoginFactoryService);

            this.userEmail = this.storeLoginFactoryService.password$.value;
            this.userPassword = this.storeLoginFactoryService.password$.value;
      }

      public ngOnInit(): void {
            this.email$ = this.storeLoginFactoryService.email$.subscribe({
                  next: (email) => (this.userEmail = email),
            });

            this.password$ = this.storeLoginFactoryService.password$.subscribe({
                  next: (password) => (this.userPassword = password),
            });
      }

      public get applicationIcon() {
            return faTasks;
      }

      public get signInIcon() {
            return faSignInAlt;
      }

      public get email() {
            return this.userEmail;
      }

      public set email(email: string) {
            this.storeLoginFactoryService.email$.value = email;
      }

      public get password() {
            return this.userPassword;
      }

      public set password(password: string) {
            this.storeLoginFactoryService.password$.value = password;
      }

      public ngOnDestroy(): void {
            this.storeLoginFactoryService.password$.unsubscribe(this.password$);
            this.storeLoginFactoryService.email$.unsubscribe(this.email$);
      }
}

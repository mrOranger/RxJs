import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { DatabaseService } from './services';

@Component({
      selector: 'tm-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
      private readonly databaseService: DatabaseService;

      private database$?: Subscription;

      public constructor() {
            this.databaseService = inject(DatabaseService);
      }

      public ngOnInit(): void {
            this.database$ = this.databaseService.initDatabase().subscribe({
                  next: () => console.log('RxDb initialized successfully!'),
                  error: () => console.error('RxDb initialization failed!'),
            });
      }

      public ngOnDestroy(): void {
            this.database$?.unsubscribe();
            this.databaseService.destroyDatabase().subscribe({
                  next: () => console.log('RxDb destroyed successfully!'),
                  error: () => console.error('RxDb destruction failed!'),
            });
      }
}

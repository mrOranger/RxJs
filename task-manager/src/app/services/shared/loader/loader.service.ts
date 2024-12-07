import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
      private readonly _loader$: BehaviorSubject<boolean>;
      private readonly _text$: BehaviorSubject<string | undefined>;

      public constructor() {
            this._loader$ = new BehaviorSubject<boolean>(false);
            this._text$ = new BehaviorSubject<string | undefined>(undefined);
      }

      public get loader$() {
            return this._loader$;
      }

      public get text$() {
            return this._text$;
      }

      public start(text?: string): void {
            this._loader$.next(true);
            this._text$.next(text);
      }

      public stop(): void {
            this._loader$.next(false);
            this._text$.next('');
      }

      public startAndStop(fn: () => void, message?: string) {
            this.start(message);
            fn();
            this.stop();
      }
}

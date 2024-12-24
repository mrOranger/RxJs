import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

      private readonly AUTH_KEY = 'auth_key';

      public get hasValidKey() {
            return !!localStorage.getItem(this.AUTH_KEY);
      }

      public set authKey(key: string) {
            localStorage.setItem(this.AUTH_KEY, key);
      }
}

import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
      private readonly AUTH_KEY = 'auth_key';
      private readonly USER_KEY = 'user_key';

      public get hasValidKey() {
            return !!localStorage.getItem(this.AUTH_KEY);
      }

      public get userId() {
            const userId = localStorage.getItem(this.USER_KEY);
            if (!userId) {
                  throw new Error(`Unauthenticated!`);
            }
            return userId;
      }

      public set userId(userId: string) {
            localStorage.setItem(this.USER_KEY, userId);
      }

      public set authKey(key: string) {
            localStorage.setItem(this.AUTH_KEY, key);
      }

      public removeAuthKey() {
            localStorage.removeItem(this.AUTH_KEY);
      }

      public removeUserId() {
            localStorage.removeItem(this.USER_KEY);
      }
}

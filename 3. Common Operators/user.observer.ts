import { Observer } from 'rxjs';

export class UserObserver implements Observer<string> {
      public constructor(private totalUser: number, private longestName: string) {}

      public next(userData: string): void {
            console.log(`Current user data: ${userData}`);
            this.totalUser = this.totalUser + 1;
            if (userData.length > this.longestName.length) {
                  this.longestName = userData;
            }
      }

      public error(error: unknown): void {
            console.error(error);
      }

      public complete(): void {
            console.log(
                  `Stream completed, total number of users: ${this.totalUser}, longest string: ${this.longestName}`,
            );
      }
}

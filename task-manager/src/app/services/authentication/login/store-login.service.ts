import { User } from "src/app/models";

import { StoreService } from "../../store.service";
import { Injectable } from "@angular/core";

@Injectable()
export class StoreLoginService extends StoreService<Pick<User, 'email' | 'password'> | null> {
      public constructor() {
            super(null);
      }
}

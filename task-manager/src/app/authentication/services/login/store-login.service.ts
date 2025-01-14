import { User } from "src/app/shared/models";

import { StoreService } from "../../../shared/services/store.service";
import { Injectable } from "@angular/core";

@Injectable()
export class StoreLoginService extends StoreService<Pick<User, 'email' | 'password'> | null> {
      public constructor() {
            super(null);
      }
}

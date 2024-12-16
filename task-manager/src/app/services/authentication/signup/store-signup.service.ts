import { User } from "src/app/models";

import { StoreService } from "../../store.service";
import { Injectable } from "@angular/core";

@Injectable()
export class StoreSignupService extends StoreService<Omit<User, 'id' | 'createdAt' | 'updatedAt'> | null> {
      public constructor() {
            super(null);
      }
}

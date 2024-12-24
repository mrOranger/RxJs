import { User } from "src/app/shared/models";

import { StoreService } from "../../../shared/services/store.service";
import { Injectable } from "@angular/core";

@Injectable()
export class StoreSignupService extends StoreService<User | null> {
      public constructor() {
            super(null);
      }
}

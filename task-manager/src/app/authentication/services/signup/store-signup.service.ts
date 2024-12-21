import { User } from "src/app/models";

import { StoreService } from "../../../services/store.service";
import { Injectable } from "@angular/core";

@Injectable()
export class StoreSignupService extends StoreService<User | null> {
      public constructor() {
            super(null);
      }
}

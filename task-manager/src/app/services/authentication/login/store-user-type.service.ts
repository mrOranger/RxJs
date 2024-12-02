import { Injectable } from '@angular/core';

import { UserType } from 'src/app/enums';
import { StoreService } from '../../store.service';

@Injectable()
export class StoreUserTypeService extends StoreService<UserType> {
      public constructor() {
            super(UserType.REGULAR_USER);
      }
}

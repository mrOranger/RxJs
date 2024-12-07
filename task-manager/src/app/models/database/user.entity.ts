import { Entity } from 'dexie';
import { DatabaseService } from 'src/app/services/database/database.service';

export class UserEntity extends Entity<DatabaseService> {
      public id!: string;
      public firstName!: string;
      public lastName!: string;
      public email!: string;
      public password!: string;
      public createdAt!: Date;
      public updatedAt!: Date;
}

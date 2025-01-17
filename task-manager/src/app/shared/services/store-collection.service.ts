import { StoreService } from './store.service';

export abstract class StoreCollectionService<T> extends StoreService<T[]> {
      public constructor() {
            super([]);
      }

      public override get subject$() {
            return super.subject$;
      }

      public add(item: T): void {
            this.value = [...this.value, item];
      }

      public update(item: T, keyName: keyof T): void {
            this.value = this.value.map((anItem) => {
                  if (anItem[keyName] === item[keyName]) {
                        return item;
                  }
                  return anItem;
            });
      }

      public delete(item: T, keyName: keyof T): void {
            this.value = this.value.filter((anItem) => anItem[keyName] === item[keyName]);
      }
}

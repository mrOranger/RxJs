import { Observer, Subject } from "rxjs";
import { OperationsType } from "./operations.type";

export class Operations {

      private static instance: Operations;
      private static subject: Subject<OperationsType>;
      private static initialized: boolean = false;

      private constructor() {
            Operations.initialized = true;
            Operations.subject = new Subject<OperationsType>();
      }

      public static getInstance(): Operations {
            if (!Operations.initialized) {
                  Operations.instance = new Operations();
            }
            return Operations.instance;
      }

      public emit(value: OperationsType) {
            Operations.subject.next(value);
      }

      public subscribe(observer: Observer<OperationsType>) {
            return Operations.subject.subscribe(observer);
      }

}

import moment from "moment";
import { Observer } from "rxjs";
import { MessageException } from "./message.exception";
import { ChatSubject } from "./chat.subject";

export class User implements Observer<string> {

      public constructor(
            private readonly firstName: string,
            private readonly lastName: string,
      ) {}

      public get fullName() {
            return `${this.firstName} ${this.lastName}`;
      }

      public get currentTimestamp() {
            return moment().locale('it').format('YYYY/MM/DD HH:mm:ss.SSSS');
      }

      public sendMessage(message: string, subject: ChatSubject) {
            if (subject.chat.closed) {
                  this.complete();
            } else {
                  subject.chat.next(`${message} (${this.fullName})`);
            }
      }

      public next (message: string) {
            let currentMessage = `[${this.currentTimestamp}] ${this.fullName} - ${message.replace(`(${this.fullName})`, '(tu)')}`;
            if (message.includes(this.fullName)) {
                  console.warn(currentMessage);
            } else {
                  console.log(currentMessage);
            }
      }

      public error(exception: MessageException) {
            console.error(`[${this.currentTimestamp}] ${exception.message}`);
      }

      public complete() {
            console.log('The chat has been closed ...');
      }

}

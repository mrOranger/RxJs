import { ReplaySubject } from "rxjs";
import { User } from "./user.observer";

export class ChatSubject {

      private _chat: ReplaySubject<string>;

      public constructor() {
            this._chat = new ReplaySubject<string>();
      }

      public get chat() {
            return this._chat;
      }

      public register(userObserver: User) {
            this._chat.subscribe(userObserver)
      }

      public close() {
            this._chat.unsubscribe();
      }

}

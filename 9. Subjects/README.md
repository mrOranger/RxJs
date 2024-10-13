# Subjects in RxJs
In the previous chapter, we analyzed the differences between **Hot** and **Cold Observables**, and we concluded that Hot Observables emits events through the Stream in a multicast way, while Cold Observables in unicast way. Therefore, subscribing to an Hot Observable after that it started to emit values results in lost of some events emitted before the Observer's subscription. On the other hand, after that an Observer subscribes to a Cold Observables, all the events previously emitted are dispatches again to the new Observer.

There are four types of built-in Observables in RxJs that shares their execution life with all the other components, these are: **Subject**, **Async Subject**, **Behavior Subject** and finally **Reply Subject**.

## Subject
Subject is the Observable with the simplest behavior, in fact, it emits values to all the Observer only once a new value is emitted. Therefore, if a new Observer subscribes to a Subject after that the last one has emit some values, it will receive only new values after the subscription of the Observer. Let's see how this Observable works:

```typescript
const subject = new Subject<number>();

subject.subscribe({
      next: (value) => console.log(`[aObserver] - ${value}`);
});

subject.next(1);
subject.next(2);

subject.subscribe({
      next: (value) => console.log(`[anotherObserver] - ${value}`);
});

subject.next(3);
subject.next(4);
```

the first Observer will observe values `1`, `2`, `3`, `4`, while the second Observer will observe only `3` and `4`. Notice with `Subject` values are emitted only explicitly, and no previous values are emitted after the subscription of a new Observer.

## Behavior Subject
Differently from normal Subject, **Behavior Subject** requires an initial value to emit as soon as an Observer subscribes to it. Moreover, as we saw from the previous example, when a new Observer subscribes to the Subject nothing happens, at least a new value is emitted from the Subject, because there is no initial value for the Subject. However, in Behavior Subject, as soon as an Observer subscribes to it, the current value is emitted notifying to the Observer what is the current state of the Subject.

Let's see from the following example how Behavior Subject works:

```typescript
const board = new BehaviorSubject<string>('0-0');

const firstObserver = board.subscribe({
      next: (score) => console.log(`(firstObserver): ${score}`),
      complete: () => console.log(`firstObserver - The game is over!`),
});

board.next('0-1');
board.next('0-2');
board.next('1-2');
board.next('1-3');

const secondObserver = board.subscribe({
      next: (score) => console.log(`(secondObserver): ${score}`),
      complete: () => console.log(`secondObserver - The game is over!`),
});


board.next('2-3');

board.complete();
```

similarly to a soccer match, the Behavior Subject acts like the Score Board, whose initial value must be `0-0` each time a new Observer (representing the viewer) subscribes to the Score Board, the current value of the Board is shown and for each score update the new value is notified to each Observer. Moreover, as soon as the game is finished, the complete action is notified to each subscribed Observer.

## Reply Subject
Up to this point, the only limitations of the previous Subjects is that all the previous values emitted by them are missed, that is, there is no possibility to emit the previous values once again. However, **Reply Subject** provides the ability to emit once more the values dispatched before the subscription of an Observer, moreover, we can define how many previous values we would like to dispatch again.

A common usage example is a chat, each time a new User joins the chat, all the previous messages are displayed to the current user, thus in the same way, the dispatch mechanism can be replicated using a Reply Subject. Let's consider the following example: in the file [`chat.subject.ts`](./chat.subject.ts) I created a custom ReplaySubject that represents a chat room, where a new User can be registered:

```typescript
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
```

thus, the next step is to create a new User that is commonly our Observer, as we can see in file [`user.observer.ts`](./user.observer.ts):

```typescript
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
```

each time a new message is dispatched, we have to control if the the dispatched message is or not of the same user who is receiving it, because, we have to signal to the UI that the message is from us, and then a different font or color must be used. Finally, we can see how these elements can be combined together:

```typescript
const chat = new ChatSubject();

const mario = new User('Mario', 'Rossi');
const maria = new User('Maria', 'Verdi');
const angela = new User('Angela', 'Bruni');
const filippo = new User('Filippo', 'Rossi');
const francesco = new User('Francesco', 'Neri');

chat.register(mario);

mario.sendMessage('Ciao a tutti!', chat);

chat.register(maria);
chat.register(angela);

maria.sendMessage('Buonasera a tutti, come state?', chat);

chat.register(filippo);
chat.register(francesco);

chat.close();

maria.sendMessage('La chat non funziona?', chat);
```

of course, after that the chat has been closed, we can notify that the message will not be dispatched again and maybe the reason of the closing. Moreover, in this simply example we use a Reply Subject that emits all the previous messages to the Observers, however, we can define how many messages must be dispatched by passing a `number` parameter to the constructor of the `ReplySubject` class.

## Async Subject

Finally, we can analyze the last type of Subject, which does not have so many common applications. In fact, `Async Subject` emits the last emitted event to each subscribed Observer only after that the subject dispatches the `complete` event to all the Observers. Let's see a simply example of it:

```typescript
const async$ = new AsyncSubject();

const first$ = async$.subscribe({
      next: (message) => console.log(`Observer n.1- ${message}`),
});

const second$ = async$.subscribe({
      next: (message) => console.log(`Observer n.2- ${message}`),
});

async$.next('Hello everybody!');
async$.next('Can u hear me?');

async$.complete();
```

after dispatching the first message `Hello everybody!` nothing happens, then after dispatching the second message `Can u hear me?` nothing happens yet. However, only after that the Subject dispatches the `complete` event to all the Observers, the last message `Can u hear me?` is received from all the Observers that will print it in the console.

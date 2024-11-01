export class MessageException extends Error {

      public constructor(
            public override readonly message: string,
      ) {
            super(`A message exception has occurred: ${message}`);
      }

}

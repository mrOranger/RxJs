import { catchError, interval, map, of } from "rxjs";

interface Transaction {
      id: number;
      date: string;
      amount: number;
      rejected?: boolean;
}

class DailyLimitExceededException extends Error {

      public constructor(
            public override readonly message: string,
            public readonly transaction: Transaction,
      ) {
            super(message);
      }
}

function transactionsStream (dailyLimit: number) {
      return interval(1000).pipe(
            map((value) => ({ id: value, date: new Date().toISOString(), amount: 1000 * Math.random()})),
            map((transaction: Transaction) => {
                  if (transaction?.amount > dailyLimit) {
                        throw new DailyLimitExceededException(`Transaction ${transaction.id} exceeds the daily limit ${dailyLimit}`, transaction);
                  }
                  return transaction;
            }),
            catchError((exception: DailyLimitExceededException) => {
                  console.error(exception.message);
                  exception.transaction.rejected = true;
                  return of(exception.transaction);
            }),
            map((transaction) => ({ ...transaction, date: new Date(transaction.date).toLocaleDateString()}))
      );
}

transactionsStream(500).subscribe({
      next: (transaction: Partial<Transaction>) => {
            if (!transaction.rejected) {
                  console.log(`Transaction ${transaction.id} [${transaction.date} - ${transaction.amount}] accepted!`);
            } else {
                  console.log(`Transaction ${transaction.id} [${transaction.date} - ${transaction.amount}] has been rejected!`);
            }
      },
      error: (exception) => console.error(`An error has been thrown ${exception}`),
      complete: () => console.log('The stream is closed'),
})

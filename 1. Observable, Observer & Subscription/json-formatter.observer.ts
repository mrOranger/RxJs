import { Observer } from 'rxjs';
import { RequestFormat } from './request-format.type';

export class JsonFormatter implements Observer<RequestFormat> {

      public next (value: RequestFormat) {
            console.log(`[${value.id}] - ${value.title} ${value.body}`);
      };

      public error (err: any) {
            console.error(err);
      };

      public complete() {
            console.log('Data flow finished');
      };
}

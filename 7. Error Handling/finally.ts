import moment from "moment";
import { catchError, finalize, interval, map, of, retry } from "rxjs";

interface ISensorData {
      id: string;
      data: string;
      temperature: number;
}

interval(500).pipe(
      map((value) => ({ id: '0015872a-e39d-4831-9cb3-9ade5a98a94f', data: moment().toISOString(), temperature: Math.max(0, Math.random() * 10) - value })),
      map((sensorData: ISensorData) => {
            if (sensorData.temperature < 0) {
                  throw new Error(`Invalid data temperature in ${sensorData.data} from sensor ${sensorData.id}`);
            }
            return sensorData;
      }),
      retry({ delay: 1000, count: 3 }),
      catchError((exception: Error) => {
            console.error(exception.message);
            return of<ISensorData>({ id: '0015872a-e39d-4831-9cb3-9ade5a98a94f', data: moment().toISOString(), temperature: NaN });
      }),
      finalize(() => console.log('Closing input stream due to technical failure ...')),
).subscribe({
      next: (sensorData) => {
            if (!isNaN(sensorData.temperature)) {
                  console.log(`Received ${sensorData.temperature}° from sensor ${sensorData.id} in ${sensorData.data}`);
            }
      },
      error: () => console.error(`An exception has occurred ...`),
      complete: () => console.log('Sensor has been closed ...'),
});

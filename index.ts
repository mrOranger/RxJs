import { v4 as uuidv4 } from 'uuid';

abstract class Subject<T> {
    protected readonly observers: Array<Observer<T>>;
    protected isClosed: boolean;

    public constructor() {
        this.observers = new Array<Observer<T>>();
        this.isClosed = false;
    }

    public abstract subscribe(observer: Observer<T>): void;
    public abstract emit(value: T): void;
    public abstract close(): void;
}

abstract class Observer<T> {
    protected readonly uuid: string;

    public constructor() {
        this.uuid = uuidv4()
    }

    public abstract next(value: T): void;
    public abstract closed(): void;
}

class Sensor extends Subject<string> {

    public constructor() {
        super();
    }

    public override subscribe(observer: Observer<string>): void {
        this.observers.push(observer);
    }
    public override emit(value: string): void {
        if (!this.isClosed) {
            this.observers.forEach((observer) => observer.next(value));
        }
    }

    public override close(): void {
        if (!this.isClosed) {
            this.observers.forEach((observer) => observer.closed());
            this.isClosed = true;
        }
    }
}

class AndroidDevice extends Observer<string> {

    private readonly temperatures: Array<string>;

    public constructor() {
        super();
        this.temperatures = [];
    }

    public get mean() {
        return this.temperatures 
            .map((temperature) => parseInt(temperature) / this.temperatures.length)
            .reduce((acc, temperature) => acc + temperature, 0);
    }

    public override next(value: string): void {
        this.temperatures.push(value);
        console.log(`[AndroidDevice] - temperature ${value}`);
    }

    public override closed(): void {
        console.log('The sensor is disconnected!');
    }
}

class IOSDevice extends Observer<string> {

    private readonly temperatures: Array<string>;

    public constructor() {
        super();
        this.temperatures = [];
    }

    public get min() {
        return this.temperatures
            .sort((aTemperature, bTemperature) => parseInt(aTemperature) - parseInt(bTemperature))
            .at(0);
    }

    public get max() {
        return this.temperatures
            .sort((aTemperature, bTemperature) => parseInt(bTemperature) - parseInt(aTemperature))
            .at(0);
    }

    public override next(value: string): void {
        this.temperatures.push(value);
        console.log(`[IOS] - temperature ${value}`)
    }

    public override closed(): void {
        console.log('The sensor is disconnected!');
    }
}

const temperatureSensor = new Sensor();
const iosDevice = new IOSDevice();
const androidDevice = new AndroidDevice();

temperatureSensor.subscribe(iosDevice);
temperatureSensor.subscribe(androidDevice);

["19.0", "21.6", "8.98", "32.2", "0.10"].forEach((value) => temperatureSensor.emit(value));

console.log(`[AndroidDevice] - Mean: ${androidDevice.mean}`);
console.log(`[IOSDevice] - Min, Max: [${iosDevice.min}, ${iosDevice.max}]`);

temperatureSensor.close();

["0.91", "11.2"].forEach((value) => temperatureSensor.emit(value));
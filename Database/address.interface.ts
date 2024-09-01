import { Geolocation } from "./geolocation.interface";

export interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geolocation;
}
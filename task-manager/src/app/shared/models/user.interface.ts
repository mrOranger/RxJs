import { Entity } from "./entity.interface";

export interface User extends Entity {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      password: string;
}

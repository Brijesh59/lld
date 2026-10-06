import { VehicleType } from "../enums/index.js";

export abstract class Vehicle {
  protected constructor(
    public readonly number: string,
    public readonly type: VehicleType,
  ) {}
}

export class Car extends Vehicle {
  constructor(number: string) {
    super(number, VehicleType.CAR);
  }
}

export class Bike extends Vehicle {
  constructor(number: string) {
    super(number, VehicleType.BIKE);
  }
}

export class Truck extends Vehicle {
  constructor(number: string) {
    super(number, VehicleType.TRUCK);
  }
}

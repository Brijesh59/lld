import {
  PaymentMode,
  PricingStrategyType,
  VehicleType,
} from "../enums/index.js";
import { Bike, Car, Truck, type Vehicle } from "../models/vehicle.js";
import {
  CardPayment,
  CashPayment,
  type PaymentStrategy,
  UpiPayment,
} from "../strategies/payment.js";
import {
  EventBasedPricing,
  type PricingStrategy,
  TimeBasedPricing,
} from "../strategies/pricing.js";

export class VehicleFactory {
  static create(number: string, type: VehicleType): Vehicle {
    switch (type) {
      case VehicleType.CAR:
        return new Car(number);
      case VehicleType.BIKE:
        return new Bike(number);
      case VehicleType.TRUCK:
        return new Truck(number);
    }
  }
}

export class PricingStrategyFactory {
  static get(type: PricingStrategyType): PricingStrategy {
    switch (type) {
      case PricingStrategyType.TIME_BASED:
        return new TimeBasedPricing();
      case PricingStrategyType.EVENT_BASED:
        return new EventBasedPricing();
    }
  }
}

export class PaymentStrategyFactory {
  static get(mode: PaymentMode): PaymentStrategy {
    switch (mode) {
      case PaymentMode.CASH:
        return new CashPayment();
      case PaymentMode.UPI:
        return new UpiPayment();
      case PaymentMode.CARD:
        return new CardPayment();
    }
  }
}

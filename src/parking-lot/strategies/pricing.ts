import { VehicleType } from "../enums/index.js";

export interface PricingStrategy {
  calculateFee(type: VehicleType, entryTime: Date, exitTime: Date): number;
}

const HOUR_MS = 60 * 60 * 1000;

const hoursRoundedUp = (entryTime: Date, exitTime: Date): number => {
  const durationMs = exitTime.getTime() - entryTime.getTime();

  if (durationMs < 0) {
    throw new Error("Exit time before entry time");
  }

  return Math.ceil(durationMs / HOUR_MS);
};

export class TimeBasedPricing implements PricingStrategy {
  private static readonly PEAK_START_HOUR = 8;
  private static readonly PEAK_END_HOUR = 17;

  calculateFee(type: VehicleType, entryTime: Date, exitTime: Date): number {
    const totalHours = hoursRoundedUp(entryTime, exitTime);

    let peakHours = 0;
    let nonPeakHours = 0;

    const cursor = new Date(entryTime);
    cursor.setMinutes(0, 0, 0);

    for (let i = 0; i < totalHours; i += 1) {
      const hour = cursor.getHours();
      const isPeak =
        hour >= TimeBasedPricing.PEAK_START_HOUR &&
        hour <= TimeBasedPricing.PEAK_END_HOUR;

      if (isPeak) {
        peakHours += 1;
      } else {
        nonPeakHours += 1;
      }

      cursor.setHours(cursor.getHours() + 1);
    }

    const peakRate: Record<VehicleType, number> = {
      [VehicleType.CAR]: 30,
      [VehicleType.BIKE]: 15,
      [VehicleType.TRUCK]: 50,
    };

    const nonPeakRate: Record<VehicleType, number> = {
      [VehicleType.CAR]: 20,
      [VehicleType.BIKE]: 10,
      [VehicleType.TRUCK]: 30,
    };

    return peakHours * peakRate[type] + nonPeakHours * nonPeakRate[type];
  }
}

export class EventBasedPricing implements PricingStrategy {
  private static readonly HOURLY_RATES: Record<VehicleType, number> = {
    [VehicleType.CAR]: 50,
    [VehicleType.BIKE]: 30,
    [VehicleType.TRUCK]: 70,
  };

  calculateFee(type: VehicleType, entryTime: Date, exitTime: Date): number {
    const hours = hoursRoundedUp(entryTime, exitTime);
    return EventBasedPricing.HOURLY_RATES[type] * hours;
  }
}

import { VehicleType } from "../enums/index.js";
import { ParkingSpot } from "./parking-spot.js";

export class ParkingFloor {
  private readonly spots = new Map<string, ParkingSpot>();

  constructor(public readonly id: string) {}

  addSpot(spot: ParkingSpot): void {
    this.spots.set(spot.id, spot);
  }

  findAvailableSpot(vehicleType: VehicleType): ParkingSpot | null {
    for (const spot of this.spots.values()) {
      if (spot.allowedType === vehicleType && spot.tryOccupy()) {
        return spot;
      }
    }

    return null;
  }

  getSpot(spotId: string): ParkingSpot | undefined {
    return this.spots.get(spotId);
  }

  getSpots(): ReadonlyMap<string, ParkingSpot> {
    return this.spots;
  }
}

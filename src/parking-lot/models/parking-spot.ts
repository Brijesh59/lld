import { VehicleType } from "../enums/index.js";

export class ParkingSpot {
  private occupied = false;

  constructor(
    public readonly id: string,
    public readonly allowedType: VehicleType,
  ) {}

  /**
   * TypeScript/Node equivalent of the Java sample's atomic-style API.
   *
   * This check-and-set is synchronous, so no other callback can interleave
   * between the check and assignment within a single Node.js event loop.
   *
   * It is NOT a distributed/process-safe lock. With worker threads, clustered
   * processes, or multiple servers, occupancy must be coordinated using shared
   * state (for example a database atomic update/transaction).
   */
  tryOccupy(): boolean {
    if (this.occupied) {
      return false;
    }

    this.occupied = true;
    return true;
  }

  vacate(): void {
    this.occupied = false;
  }

  isOccupied(): boolean {
    return this.occupied;
  }
}

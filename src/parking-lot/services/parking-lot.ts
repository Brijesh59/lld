import { randomUUID } from "node:crypto";
import {
  PaymentMode,
  PricingStrategyType,
} from "../enums/index.js";
import {
  PaymentStrategyFactory,
  PricingStrategyFactory,
} from "../factories/index.js";
import type { ParkingFloor } from "../models/parking-floor.js";
import { Ticket } from "../models/ticket.js";
import type { Vehicle } from "../models/vehicle.js";
import type { PricingStrategy } from "../strategies/pricing.js";
import { PaymentProcessor } from "./payment-processor.js";

export class ParkingLot {
  private static readonly INSTANCE = new ParkingLot();

  private readonly floors = new Map<string, ParkingFloor>();
  private readonly activeTickets = new Map<string, Ticket>();

  private pricingStrategy: PricingStrategy;

  private constructor() {
    this.pricingStrategy = PricingStrategyFactory.get(
      PricingStrategyType.TIME_BASED,
    );
  }

  static getInstance(): ParkingLot {
    return ParkingLot.INSTANCE;
  }

  setPricingStrategy(pricingStrategy: PricingStrategy): void {
    this.pricingStrategy = pricingStrategy;
  }

  addFloor(floor: ParkingFloor): void {
    this.floors.set(floor.id, floor);
  }

  parkVehicle(vehicle: Vehicle, entryTime: Date): Ticket | null {
    for (const floor of this.floors.values()) {
      const spot = floor.findAvailableSpot(vehicle.type);

      if (!spot) {
        continue;
      }

      const ticket = new Ticket({
        ticketId: randomUUID(),
        entryTime,
        vehicle,
        floorId: floor.id,
        spotId: spot.id,
      });

      this.activeTickets.set(ticket.ticketId, ticket);
      console.log(`Vehicle parked. Ticket: ${ticket.ticketId}`);
      return ticket;
    }

    console.log(`No spot available for vehicle type: ${vehicle.type}`);
    return null;
  }

  unparkVehicle(
    ticketId: string,
    exitTime: Date,
    paymentMode: PaymentMode,
  ): boolean {
    const ticket = this.activeTickets.get(ticketId);

    if (!ticket) {
      console.log("Invalid ticket ID.");
      return false;
    }

    const fee = this.pricingStrategy.calculateFee(
      ticket.vehicle.type,
      ticket.entryTime,
      exitTime,
    );

    const strategy = PaymentStrategyFactory.get(paymentMode);
    const processor = new PaymentProcessor(strategy);
    const paid = processor.pay(ticket, fee);

    if (!paid) {
      console.log("Vehicle cannot exit. Payment unsuccessful.");
      return false;
    }

    const floor = this.floors.get(ticket.floorId);
    const spot = floor?.getSpot(ticket.spotId);

    if (!floor || !spot) {
      throw new Error(
        `Parking state corrupted for ticket ${ticket.ticketId}: floor/spot not found`,
      );
    }

    spot.vacate();
    this.activeTickets.delete(ticketId);

    console.log(`Vehicle exited. Fee charged: ₹${fee}`);
    return true;
  }

  printStatus(): void {
    for (const [floorId, floor] of this.floors) {
      console.log(`Floor: ${floorId}`);

      for (const spot of floor.getSpots().values()) {
        console.log(
          ` Spot ${spot.id} [${spot.allowedType}] - ${spot.isOccupied() ? "Occupied" : "Free"}`,
        );
      }
    }
  }

  getActiveTicket(ticketId: string): Ticket | undefined {
    return this.activeTickets.get(ticketId);
  }
}

import { GateType, PaymentMode } from "../enums/index.js";
import { ParkingLot } from "../services/parking-lot.js";
import type { Ticket } from "./ticket.js";
import type { Vehicle } from "./vehicle.js";

export abstract class Gate {
  protected constructor(public readonly id: string) {}

  abstract getType(): GateType;
}

export class EntryGate extends Gate {
  getType(): GateType {
    return GateType.ENTRY;
  }

  parkVehicle(vehicle: Vehicle, entryTime: Date): Ticket | null {
    return ParkingLot.getInstance().parkVehicle(vehicle, entryTime);
  }
}

export class ExitGate extends Gate {
  getType(): GateType {
    return GateType.EXIT;
  }

  unparkVehicle(
    ticketId: string,
    exitTime: Date,
    paymentMode: PaymentMode,
  ): boolean {
    return ParkingLot.getInstance().unparkVehicle(
      ticketId,
      exitTime,
      paymentMode,
    );
  }
}

import { PaymentStatus } from "../enums/index.js";
import type { Vehicle } from "./vehicle.js";

export interface TicketParams {
  ticketId: string;
  entryTime: Date;
  vehicle: Vehicle;
  floorId: string;
  spotId: string;
}

export class Ticket {
  public paymentStatus = PaymentStatus.PENDING;

  public readonly ticketId: string;
  public readonly entryTime: Date;
  public readonly vehicle: Vehicle;
  public readonly floorId: string;
  public readonly spotId: string;

  constructor(params: TicketParams) {
    this.ticketId = params.ticketId;
    this.entryTime = params.entryTime;
    this.vehicle = params.vehicle;
    this.floorId = params.floorId;
    this.spotId = params.spotId;
  }
}

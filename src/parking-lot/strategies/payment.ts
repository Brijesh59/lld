import type { Ticket } from "../models/ticket.js";

export interface PaymentStrategy {
  processPayment(ticket: Ticket, amount: number): boolean;
}

export class CashPayment implements PaymentStrategy {
  processPayment(ticket: Ticket, amount: number): boolean {
    console.log(`Paid ₹${amount} for ticket ${ticket.ticketId} via Cash.`);
    return true;
  }
}

export class UpiPayment implements PaymentStrategy {
  processPayment(ticket: Ticket, amount: number): boolean {
    console.log(`Paid ₹${amount} for ticket ${ticket.ticketId} via UPI.`);
    return true;
  }
}

export class CardPayment implements PaymentStrategy {
  processPayment(ticket: Ticket, amount: number): boolean {
    console.log(`Paid ₹${amount} for ticket ${ticket.ticketId} via Card.`);
    return true;
  }
}

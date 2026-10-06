import { PaymentStatus } from "../enums/index.js";
import type { Ticket } from "../models/ticket.js";
import type { PaymentStrategy } from "../strategies/payment.js";

export class PaymentProcessor {
  constructor(private readonly strategy: PaymentStrategy) {}

  pay(ticket: Ticket, amount: number): boolean {
    const success = this.strategy.processPayment(ticket, amount);

    if (success) {
      ticket.paymentStatus = PaymentStatus.SUCCESS;
    } else {
      ticket.paymentStatus = PaymentStatus.FAILED;
      console.log(`Payment failed for ticket: ${ticket.ticketId}`);
    }

    return success;
  }
}

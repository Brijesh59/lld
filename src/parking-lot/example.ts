import {
  DateTimeParser,
  EntryGate,
  EventBasedPricing,
  ExitGate,
  ParkingFloor,
  ParkingLot,
  ParkingSpot,
  PaymentMode,
  VehicleFactory,
  VehicleType,
} from "./index.js";

const lot = ParkingLot.getInstance();
const entryGate = new EntryGate("EG1");
const exitGate = new ExitGate("XG1");

lot.setPricingStrategy(new EventBasedPricing());

const floor1 = new ParkingFloor("Floor1");
floor1.addSpot(new ParkingSpot("F1S1", VehicleType.BIKE));
floor1.addSpot(new ParkingSpot("F1S2", VehicleType.CAR));
floor1.addSpot(new ParkingSpot("F1S3", VehicleType.TRUCK));
floor1.addSpot(new ParkingSpot("F1S4", VehicleType.CAR));
lot.addFloor(floor1);

console.log("--------------------------");

const bike1 = VehicleFactory.create("KA01AB1234", VehicleType.BIKE);
const bike2 = VehicleFactory.create("KA01AB5678", VehicleType.BIKE);
const entryTime = DateTimeParser.parse("21 May 7:30 AM 2025");

/**
 * The Java source starts two Threads against one bike spot.
 *
 * Node.js does not interleave synchronous statements on a single event loop,
 * so these two calls execute one after another. The important domain contract
 * remains the same: tryOccupy() is a check-and-set operation and only one call
 * can change a free spot to occupied in this process.
 */
const ticket1 = entryGate.parkVehicle(bike1, entryTime);
const ticket2 = entryGate.parkVehicle(bike2, entryTime);

console.log("Bike 1 ticket:", ticket1?.ticketId ?? "No spot available");
console.log("Bike 2 ticket:", ticket2?.ticketId ?? "No spot available");

console.log("--------------------------");
lot.printStatus();

if (ticket1) {
  const exitTime = DateTimeParser.parse("21 May 1:15 PM 2025");
  exitGate.unparkVehicle(ticket1.ticketId, exitTime, PaymentMode.UPI);
}

console.log("--------------------------");
lot.printStatus();

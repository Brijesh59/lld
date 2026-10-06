import { describe, expect, it } from "vitest";
import {
  EventBasedPricing,
  ParkingFloor,
  ParkingLot,
  ParkingSpot,
  PaymentMode,
  VehicleFactory,
  VehicleType,
} from "../index.js";

describe("ParkingSpot", () => {
  it("allows exactly one successful occupancy until vacated", () => {
    const spot = new ParkingSpot("B1", VehicleType.BIKE);

    expect(spot.tryOccupy()).toBe(true);
    expect(spot.tryOccupy()).toBe(false);
    expect(spot.isOccupied()).toBe(true);

    spot.vacate();

    expect(spot.tryOccupy()).toBe(true);
  });
});

describe("ParkingFloor", () => {
  it("only allocates spots compatible with the vehicle type", () => {
    const floor = new ParkingFloor("F1");
    floor.addSpot(new ParkingSpot("B1", VehicleType.BIKE));
    floor.addSpot(new ParkingSpot("C1", VehicleType.CAR));

    const bikeSpot = floor.findAvailableSpot(VehicleType.BIKE);

    expect(bikeSpot?.id).toBe("B1");
    expect(floor.getSpot("C1")?.isOccupied()).toBe(false);
  });

  it("does not allocate one spot twice", () => {
    const floor = new ParkingFloor("F2");
    floor.addSpot(new ParkingSpot("B1", VehicleType.BIKE));

    expect(floor.findAvailableSpot(VehicleType.BIKE)?.id).toBe("B1");
    expect(floor.findAvailableSpot(VehicleType.BIKE)).toBeNull();
  });
});

describe("Pricing strategies", () => {
  it("calculates event pricing by rounded-up hours", () => {
    const strategy = new EventBasedPricing();
    const entry = new Date(2025, 4, 21, 7, 30);
    const exit = new Date(2025, 4, 21, 9, 1);

    expect(strategy.calculateFee(VehicleType.BIKE, entry, exit)).toBe(60);
  });
});

describe("ParkingLot flow", () => {
  it("parks, charges, and vacates a vehicle", () => {
    const lot = ParkingLot.getInstance();
    const floorId = `integration-${Date.now()}`;
    const spotId = `${floorId}-car`;
    const floor = new ParkingFloor(floorId);
    const spot = new ParkingSpot(spotId, VehicleType.CAR);

    floor.addSpot(spot);
    lot.addFloor(floor);
    lot.setPricingStrategy(new EventBasedPricing());

    const car = VehicleFactory.create("KA01AB1234", VehicleType.CAR);
    const entry = new Date(2025, 4, 21, 10, 0);
    const exit = new Date(2025, 4, 21, 11, 0);

    const ticket = lot.parkVehicle(car, entry);

    expect(ticket).not.toBeNull();
    expect(spot.isOccupied()).toBe(true);

    const exited = lot.unparkVehicle(ticket!.ticketId, exit, PaymentMode.CARD);

    expect(exited).toBe(true);
    expect(spot.isOccupied()).toBe(false);
    expect(lot.getActiveTicket(ticket!.ticketId)).toBeUndefined();
  });
});

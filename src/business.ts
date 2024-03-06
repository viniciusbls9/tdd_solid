import crypto from "crypto";
import {
  getActiveReservations,
  getRoom,
  saveReservation,
  updateReservationStatus,
} from "./data";

export async function makeReservation(input: any) {
  if (input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");

  const reservation = {
    ...input,
    reservationId: crypto.randomUUID(),
    status: "active",
    price: 0,
    duration: 0,
  };

  const room = await getRoom(input.roomId);
  const reservations = await getActiveReservations(
    input.roomId,
    input.checkinDate,
    input.checkoutDate
  );
  const isAvailable = reservation.length === 0;
  if (isAvailable) throw new Error("Room is not available");
  if (room.type === "day") {
    reservation.duration =
      new Date(input.checkoutDate).getTime() -
      new Date(input.checkinDate).getTime() / (1000 * 60 * 60 * 24);
    reservation.price = reservation.duration * parseFloat(room.price);
  }

  if (room.type === "hour") {
    reservation.duration =
      new Date(input.checkoutDate).getTime() -
      new Date(input.checkinDate).getTime() / (1000 * 60 * 60);
    reservation.price = reservation.duration * parseFloat(room.price);
  }
  await saveReservation(reservation);
  return reservation;
}

export async function cancelReservation(reservationId: string) {
  await updateReservationStatus(reservationId, "cancelled");
}

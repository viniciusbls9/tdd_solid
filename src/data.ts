import pgp from "pg-promise";

export async function getRoom(roomId: string) {
  const connection = pgp()("postgres:postgres:123456@localhost:5432/app");
  const [room] = await connection.query(
    "select * from branas.room where room_id = $1",
    [roomId]
  );
  await connection.$pool.end();
  return room;
}

export async function getActiveReservations(
  roomId: string,
  checkinDate: Date,
  checkoutDate: Date
) {
  const connection = pgp()("postgres:postgres:123456@localhost:5432/app");
  const reservations = await connection.query(
    "select * from branas.reservation where room_id = $1 and (checkin_date, checkout_date) overlaps ($2, $3), and status = 'active'",
    [roomId, checkinDate, checkoutDate]
  );
  await connection.$pool.end();
  return reservations;
}

export async function saveReservation(reservation: any) {
  const connection = pgp()("postgres:postgres:123456@localhost:5432/app");
  await connection.query(
    "insert into branas.reservation (reservation_id, room_id, email, checkin_date, checkout_date, price, status) values ($1, $2, $3, $4, $5, $6, $7",
    [
      reservation.reservationId,
      reservation.roomId,
      reservation.email,
      reservation.checkinDate,
      reservation.checkoutDate,
      reservation.price,
      reservation.status,
    ]
  );
  await connection.$pool.end();
}

export async function updateReservationStatus(
  reservationId: string,
  status: string
) {
  const connection = pgp()("postgres:postgres:123456@localhost:5432/app");
  await connection.query(
    "update branas.reservation set status = $1 where reservation_id = $2",
    [status, reservationId]
  );
}

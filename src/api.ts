import express from "express";
import { cancelReservation, makeReservation, getReservation } from "./business";
const app = express();
app.use(express.json());

app.post("/make_reservation", async function (req, res) {
  const input = req.body;

  try {
    const output = await makeReservation(input);
    res.json(output);
  } catch (e: any) {
    res.status(422).json({
      message: e.message,
    });
  }
});

app.post("/reservations/:reservationId", async function (req, res) {
  const output = await getReservation(req.params.reservationId);
});

app.post("/cancel_reservation", async function (req, res) {
  await cancelReservation(req.body.reservationId);
  res.end();
});

app.listen(3000);

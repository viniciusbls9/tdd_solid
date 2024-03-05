import express from "express";
const app = express();
app.use(express.json());

app.post("/make_reservation", async function (req, res) {
  const input = req.body;
  res.json();
});

app.post("/cancel_reservation", async function (req, res) {
  res.end();
});

app.listen(3000);

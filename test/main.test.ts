import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

test("should not book a room with invalid email", async () => {
  const input = {
    roomId: "aa354842-59bf-42e6-be3a-6188dbb5fff8",
    email: "john.doe",
    checkinDate: "2024-03-03T10:00:00",
    checkoutDate: "2024-03-08T10:00:00",
  };
  const response = await axios.post(
    "http://localhost:3000/make_reservation",
    input
  );
  expect(response.status).toBe(422);
  const output = response.data;
  expect(output.message).toBe("Invalid email");
});

test("should book one room per day", async function () {
  const input = {
    roomId: "aa354842-59bf-42e6-be3a-6188dbb5fff8",
    email: "john.doe@gmail.com",
    checkinDate: "2024-03-03T10:00:00",
    checkoutDate: "2024-03-08T10:00:00",
  };
  const response = await axios.post(
    "http://localhost:3000/make_reservation",
    input
  );
  const output = response.data;
  expect(output.reservationId).toBeDefined();
  expect(output.duration).toBe(5);
  expect(output.price).toBe(5000);
  await axios.post("http://localhost:3000/cancel_reservation", output);
});

test("Should not book a room per day in a period already reserved", async function () {
  const input = {
    roomId: "aa354842-59bf-42e6-be3a-6188dbb5fff8",
    email: "john.doe@gmail.com",
    checkinDate: "2024-03-03T10:00:00",
    checkoutDate: "2024-03-08T10:00:00",
  };
  const response = await axios.post(
    "http://localhost:3000/make_reservation",
    input
  );
  const output = response.data;
  const response2 = await axios.post(
    "http://localhost:3000/make_reservation",
    input
  );
  expect(response2.status).toBe(422);
  const output2 = response2.data;
  expect(output2.message).toBe("Room is not available");
  await axios.post("http://localhost:3000/cancel_reservation", output);
});

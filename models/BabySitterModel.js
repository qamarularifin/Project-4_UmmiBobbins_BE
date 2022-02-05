const mongoose = require("mongoose");

const UserBabySitterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "babysitter" },
  location: { type: String, required: true },
  quote: { type: String },
  currentBookings: [],
});

const userBabySitterModel = mongoose.model(
  "UserBabySitter",
  UserBabySitterSchema
);

module.exports = userBabySitterModel;

const mongoose = require("mongoose");

const UserParentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "parent" },
  location: { type: String, required: true },
  quote: { type: String },
  currentBookings: [],
});

const userParentModel = mongoose.model("UserParent", UserParentSchema);

module.exports = userParentModel;

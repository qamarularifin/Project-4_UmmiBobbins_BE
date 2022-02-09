const mongoose = require("mongoose");

const BabySitterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    ratePerHour: {
      type: Number,
      required: true,
    },
    image: { type: String },
    currentBookings: [],
  },
  { collection: "babysitter-data" }
);

const babySitterModel = mongoose.model("BabySitter", BabySitterSchema);

module.exports = babySitterModel;
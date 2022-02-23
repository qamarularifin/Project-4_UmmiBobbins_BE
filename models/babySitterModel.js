const mongoose = require("mongoose");

const BabySitterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    location: { type: Number, required: true },
    description: { type: String, required: true },
    ratePerDay: {
      type: Number,
      required: true,
    },
    image: { type: String },
    messages: [String],
    currentBookings: [
      { type: mongoose.Types.ObjectId, ref: "Booking", required: true },
    ],
  },
  { collection: "babysitter-data" }
);

const babySitterModel = mongoose.model("BabySitter", BabySitterSchema);

module.exports = babySitterModel;

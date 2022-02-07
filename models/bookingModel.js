const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    parentUserId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Parent",
    },
    babySitterId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "BabySitter",
    },
    fromTime: { type: String, required: true },
    toTime: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    transactionId: { type: String },
    status: { type: Boolean, required: true, default: false },
  },
  { collection: "booking-data" }
);

const bookingModel = mongoose.model("Booking", BookingSchema);

module.exports = bookingModel;

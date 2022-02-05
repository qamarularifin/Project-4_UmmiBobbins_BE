const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  parentUserId: {
    type: mongoose.SchemaType.Types.ObjectId,
    required: true,
    ref: "UserParent",
  },
  babySitterId: {
    type: mongoose.SchemaType.Types.ObjectId,
    required: true,
    ref: "UserBabySitter",
  },
  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  totalDays: { type: Number, required: true },
  transactionId: { type: String },
  status: { type: Boolean, required: true, default: false },
});

const bookingModel = mongoose.model("Booking", BookingSchema);

module.exports = bookingModel;

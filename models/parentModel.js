const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    location: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    messages: [String],
    currentBookings: [
      { type: mongoose.Types.ObjectId, ref: "Booking", required: true },
    ],
  },
  { collection: "parent-data" }
);

const parentModel = mongoose.model("Parent", ParentSchema);

module.exports = parentModel;

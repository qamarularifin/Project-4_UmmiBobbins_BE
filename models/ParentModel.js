const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    currentBookings: [],
  },
  { collection: "parent-data" }
);

const parentModel = mongoose.model("Parent", ParentSchema);

module.exports = parentModel;

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

    currentBookings: [],
  },
  { collection: "parent-data" }
);

const parentModel = mongoose.model("Parent", ParentSchema);

module.exports = parentModel;

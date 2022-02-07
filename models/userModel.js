const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    created: { type: Boolean, default: false },
    quote: { type: String },
  },
  { collection: "user-data" }
);

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

exports.PasswordShareRequestSchema = new Schema(
  {
    fromUser: {
      type: String,
      required: true,
    },
    toUser: {
      type: String,
      required: true,
    },
    passwordId: {
      type: Schema.Types.ObjectId,
      ref: "Password",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { collection: "passwordShareRequestsSpr2023" }
);

import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  refreshToken: {
    type: String,
    required: true
  },

  revoked: {
    type: Boolean,
    default: false
  },

  expiresAt: {
    type: Date
  }

}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
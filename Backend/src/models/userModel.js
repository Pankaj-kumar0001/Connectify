import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import config from "../config/config.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {

  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);

});

userSchema.methods.comparePassword = async function (userPassword) {

  return await bcrypt.compare(userPassword, this.password);

};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);

export default User;
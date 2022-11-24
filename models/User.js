import mongoose from "mongoose";

import Portfolio from "./Portfolio.js";

const UserSchema = new mongoose.Schema({
  customerId: {
    type: Number,
    required: true,
    unique: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  DOB: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  tel: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nairaWallet: {
    type: Number,
    default: 0,
  },
  dollarWallet: {
    type: Number,
    default: 0,
  },
  referralWallet: {
    type: Number,
    default: 0,
  },
  referralCode: {
    type: Number,
    default: 0,
  },
  personalReferralCode: {
    type: Number,
    default: 0,
  },
  portfolios: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Portfolio",
    },
  ],
  activities: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Activity",
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  verificationCode: {
    type: String,
    default: "",
  },
  resetPasswordCode: {
    type: Number,
    default: 0,
  },
  bvn: {
    type: Number,
    default: 0,
  },
  idCard: {
    path: {
      type: String,
      default: "",
    },
    filename: String,
  },
  banks: [
    {
      bankName: String,
      accountName: String,
      accountNumber: Number,
    },
  ],
  loggedInTime: {
    type: Date,
  },
});

export default mongoose.model("User", UserSchema);

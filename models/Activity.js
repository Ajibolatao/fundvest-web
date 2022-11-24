import mongoose from "mongoose";
import User from "./User.js";

const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  receipt: {
    type: String,
  },
});

export default mongoose.model("Activity", ActivitySchema);

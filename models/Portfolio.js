import mongoose from "mongoose";


const PortfolioSchema = new mongoose.Schema({
  portfolioId: {
    type: Number,
    required: true,
    unique: true,
  },
  plan: {
    type: String,
    required: true,
  },
  isMatured: {
    type: Boolean,
    default: false,
  },
  principal: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now(),
  },
  proposedTotalInterest: {
    type: Number,
    required: true,
  },
  proposedTotalAmount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    default: Date.now(),
  },
  dailyInterest: {
    type: Number,
  },
  currentInterest: {
    type: Number,
    default: 0,

    // required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
    // required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("Portfolio", PortfolioSchema);

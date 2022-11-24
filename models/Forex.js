import mongoose from "mongoose";


const ForexSchema = new mongoose.Schema({
   name: {
      type: String,
      unique: true,
   },
  buyingPrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("Forex", ForexSchema);

/*const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);*/
const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  email: { type: String, required: true },
  contact: { type: String, required: true },
  instagram: { type: String },
  facebook: { type: String },
  twitter: { type: String },
  image: { type: String, required: true }, // Add this field for storing the image URL
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Shop", shopSchema);


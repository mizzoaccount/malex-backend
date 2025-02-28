const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  image: {
    type: String, // This will store the image URL
  },
}, {
  timestamps: true,
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;


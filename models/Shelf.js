/*const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: String,
  role: String,
});

const ShelfSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: String,
  members: [MemberSchema],
});

module.exports = mongoose.models.Shelf || mongoose.model("Shelf", ShelfSchema);*/
const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String, // Added image field for each member
});

const ShelfSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  price: String,
  members: [MemberSchema], // Each member now includes an image
});

module.exports = mongoose.models.Shelf || mongoose.model("Shelf", ShelfSchema);

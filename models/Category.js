/*const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);*/

const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String }, // New field to store the Cloudinary image URL
});

module.exports = mongoose.models.Category || mongoose.model('Category', CategorySchema);


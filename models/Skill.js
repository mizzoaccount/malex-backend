/*const mongoose = require("mongoose");

const PortfolioSchema = new mongoose.Schema({
  image: String,
  title: String,
  description: String,
});

const ReviewSchema = new mongoose.Schema({
  username: String,
  rating: Number,
  comment: String,
});

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: false },
  level: { type: String, required: false },
  rating: { type: Number, required: false },
  description: { type: String, required: false },
  price: { type: Number, required: false },
  cimage: { type: String, required: false },
  pimage: { type: String, required: false },
  portfolio: [PortfolioSchema],
  reviews: [ReviewSchema],
});

module.exports = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);*/


const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String, // Added image field for each member
});

const SkillSchema = new mongoose.Schema({
  name: String,
  description: String,
  service: String,
  cimage: String,
  pimage: String,
  level:String,
  stdprice:String,
  stdprice: String,
  contact:String,
  members: [MemberSchema], // Each member now includes an image
});

module.exports = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);


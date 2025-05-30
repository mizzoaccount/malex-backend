/*const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  designer: {
    type: String,
    required: true
  },
  category: {
    main: {
      type: String,
      required: true
    },
    sub: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    }
  },
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  attributes: {
    type: Object,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);*/

const mongoose = require('mongoose');

const detailSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const specificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

const productSchema = new mongoose.Schema({
  mainCategory: {
    type: String,
    required: true
  },
  subCategory: {
    type: String,
    required: true
  },
  details: [detailSchema],
  specifications: [specificationSchema],
  batchNumber: {
    type: String,
    required: true
  },
  netContent: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  certifications: [{
    type: String
  }],
  images: [{
    type: String,
    required: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Product', productSchema);
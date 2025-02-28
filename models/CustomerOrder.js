/*const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId: String,
    customerEmail: String,
    mpesaCode: String,
    mpesaName: String,
    mpesaNumber: String,
    amount: Number,
    shipping_fee: Number,
    shippingInfo: shippingInfoSchema,
    products: Array,
    price: Number,
    delivery_status: { type: String, default: 'pending' },
    payment_status: { type: String, default: 'unpaid' },
    date: String
});

const customerOrder = mongoose.model('CustomerOrder', orderSchema);

module.exports = customerOrder;*/


const mongoose = require('mongoose');

const shippingInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  additionalInfo: { type: String },
});

const orderSchema = new mongoose.Schema({
  customerId: String,
  customerName: String,
  mpesaCode: String,
  mpesaName: String,
  mpesaNumber: String,
  amount: Number,
  shipping_fee: Number,
  shippingInfo: shippingInfoSchema,
  products: Array,
  price: Number,
  delivery_status: { type: String, default: 'pending' },
  payment_status: { type: String, default: 'unpaid' },
  date: String,
});

const CustomerOrder = mongoose.model('CustomerOrder', orderSchema);

module.exports = CustomerOrder; // Ensure you are exporting the correct model

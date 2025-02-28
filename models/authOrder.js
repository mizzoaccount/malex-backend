const mongoose = require('mongoose');

const authorOrderSchema = new mongoose.Schema({
    //orderId: mongoose.Schema.Types.ObjectId,
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'CustomerOrder', required: false, default: null },
    sellerId: String,
    products: Array,
    price: Number,
    payment_status: { type: String, default: 'unpaid' },
    shippingInfo: String,
    delivery_status: { type: String, default: 'pending' },
    date: String,
    mpesaCode: String,
    mpesaName: String,
    mpesaNumber: String,
    amount: Number
});

const authOrderModel = mongoose.model('AuthOrder', authorOrderSchema);

module.exports = authOrderModel;


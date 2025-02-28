const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/place-order', orderController.place_order);
// Route to get all orders
router.get('/orders', orderController.getOrders);


router.get('/orders/customer/:customerId', orderController.getOrdersByCustomerId);

// Route to get a specific order by ID
router.get('/orders/:id', orderController.getOrderById);

router.get('/:sellerId', orderController.getOrdersBySellerId);

module.exports = router;

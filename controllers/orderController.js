/*const moment = require('moment');
const customerOrder = require('../models/CustomerOrder');
const authOrderModel = require('../models/authOrder');

const orderController = {
    place_order: async (req, res) => {
        const {
            price,
            products,
            shipping_fee,
            shippingInfo,
            userId,
            customerEmail,
            mpesaCode,
            mpesaName,
            mpesaNumber,
            amount
        } = req.body;
  
    console.log('Order Data Received:', req.body); // Logs the entire request body
    console.log('Products Received:', JSON.stringify(products, null, 2)); // Logs the products in a readable format

    // Validate required fields
    const requiredFields = ['price', 'products', 'shipping_fee', 'shippingInfo', 'userId', 'customerEmail', 'mpesaCode', 'mpesaName', 'mpesaNumber', 'amount'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
        console.log('Missing required fields:', missingFields);
        return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    if (!Array.isArray(products) || products.length === 0) {
        console.log('Products array is missing or empty:', products);
        return res.status(400).json({ message: 'Products array is missing or empty' });
    }

        let authorOrderData = [];
        let cardIds = [];
        const tempDate = moment(Date.now()).format('LLL');
        let customerOrderProducts = [];

        // Process products
        for (let i = 0; i < products.length; i++) {
            // Extract product list from the current product object
            const productList = products[i].products; // This should be an array of products

            if (!Array.isArray(productList) || productList.length === 0) {
                console.log('Product list is missing or empty for product:', products[i]);  // Log the problematic product
                return res.status(400).json({ message: 'Product list is missing or empty' });
            }

            for (let j = 0; j < productList.length; j++) {
                const { productInfo, quantity, _id } = productList[j];

                console.log('Processing product:', productList[j]); // Log the entire product object for debugging
                console.log('ProductInfo:', productInfo, 'Quantity:', quantity, 'ID:', _id); // Log individual fields

                if (!productInfo || !quantity || !_id) {
                    console.log('Skipping invalid product:', productList[j]);  // Log invalid product
                    continue; // Skip invalid products
                }

                let tempProduct = { ...productInfo, quantity };
                customerOrderProducts.push(tempProduct);

                if (_id) {
                    cardIds.push(_id);
                }

                // Ensure that we are correctly extracting sellerId and price for each product
                const sellerId = products[i].sellerId && products[i].sellerId[j]; // Access sellerId corresponding to the current product
                const sellerPrice = products[i].price && products[i].price[j];   // Access price corresponding to the current product

                console.log('Extracted Seller ID:', sellerId, 'Price:', sellerPrice); // Log seller ID and price

                if (!sellerId || !sellerPrice) {
                    console.log(`Missing sellerId or price for product at index ${i}, sellerId: ${sellerId}, price: ${sellerPrice}`);
                    return res.status(400).json({ message: 'Missing sellerId or price for one or more products' });
                }

                console.log(`Processing product for sellerId: ${sellerId}, price: ${sellerPrice}`);

                let storeProducts = [];

                for (let k = 0; k < productList.length; k++) {
                    const { productInfo, quantity } = productList[k];

                    if (!productInfo || !quantity) {
                        console.log('Skipping invalid product in storeProducts:', productList[k]);  // Log invalid product
                        continue; // Skip invalid products
                    }

                    let tempProduct = { ...productInfo, quantity };
                    storeProducts.push(tempProduct);
                }

                authorOrderData.push({
                    orderId: order.id,
                    sellerId, // Ensure sellerId is defined
                    products: storeProducts,
                    price: sellerPrice, // Ensure price is defined
                    payment_status: 'unpaid',
                    shippingInfo: 'Dhaka Express Warehouse',
                    delivery_status: 'pending',
                    date: tempDate,
                    mpesaCode,
                    mpesaName,
                    mpesaNumber,
                    amount
                });

                console.log(`authorOrderData after pushing product ${i}:${j}:`, authorOrderData);  // Log authorOrderData at each step
            }
        }
        try {
            // Extract all products
            const allProducts = products.flatMap(p => p.products);
        
            const customerOrderProducts = [];
            const authorOrderData = [];
        
            allProducts.forEach(product => {
                const productInfo = {
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: product.quantity,
                    image: product.image,
                    color: product.color,
                    stock: product.stock,
                    sellerId: product.sellerId
                };
        
                if (!productInfo.id || !productInfo.name || productInfo.quantity <= 0) {
                    console.log('Skipping invalid product:', productInfo);
                } else {
                    console.log('Processing product:', productInfo);
        
                    // Push to the respective arrays
                    customerOrderProducts.push(productInfo);
        
                    authorOrderData.push({
                        orderId: null, // Placeholder
                        sellerId: productInfo.sellerId,
                        products: [productInfo],
                        price: productInfo.price * productInfo.quantity,
                        payment_status: 'unpaid',
                        shippingInfo: `${shippingInfo.city} Warehouse`,
                        delivery_status: 'pending',
                        date: new Date().toISOString(),
                        mpesaCode,
                        mpesaName,
                        mpesaNumber,
                        amount
                    });
                }
            });
        
            // Proceed with creating the order
            if (customerOrderProducts.length > 0) {
                const order = await customerOrder.create({
                    customerId: userId,
                    customerEmail,
                    mpesaCode,
                    mpesaName,
                    mpesaNumber,
                    amount,
                    shipping_fee,
                    shippingInfo,
                    products: customerOrderProducts,
                    price,
                    delivery_status: 'pending',
                    payment_status: 'unpaid',
                    date: new Date().toISOString()
                });
        
                // Update orderId in authorOrderData
                authorOrderData.forEach(data => {
                    data.orderId = order._id;
                });
        
                const insertedOrders = await authOrderModel.insertMany(authorOrderData);
                console.log('AuthOrders successfully inserted:', insertedOrders);
        
                res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
            } else {
                console.error('No valid products found to process the order');
                res.status(400).json({ message: 'No valid products found' });
            }
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).json({ message: 'Error placing order', error: error.message });
        }
        
    }
};

module.exports = orderController;*/


const moment = require('moment');
const customerOrder = require('../models/CustomerOrder');
const authOrderModel = require('../models/authOrder');

// Controller for placing an order
const orderController = {
  place_order: async (req, res) => {
    const {
      price,
      products,
      shipping_fee,
      shippingInfo,
      userId,
      customerEmail,
      mpesaCode,
      mpesaName,
      mpesaNumber,
      amount
    } = req.body;

    console.log('Order Data Received:', req.body); // Logs the entire request body
    console.log('Products Received:', JSON.stringify(products, null, 2)); // Logs the products in a readable format

    // Validate required fields
    const requiredFields = ['price', 'products', 'shipping_fee', 'shippingInfo', 'userId', 'customerEmail', 'mpesaCode', 'mpesaName', 'mpesaNumber', 'amount'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    if (!Array.isArray(products) || products.length === 0) {
      console.log('Products array is missing or empty:', products);
      return res.status(400).json({ message: 'Products array is missing or empty' });
    }

    let authorOrderData = [];
    let cardIds = [];
    const tempDate = moment(Date.now()).format('LLL');
    let customerOrderProducts = [];

    // Process products
    for (let i = 0; i < products.length; i++) {
      // Extract product list from the current product object
      const productList = products[i].products; // This should be an array of products

      if (!Array.isArray(productList) || productList.length === 0) {
        console.log('Product list is missing or empty for product:', products[i]);  // Log the problematic product
        return res.status(400).json({ message: 'Product list is missing or empty' });
      }

      for (let j = 0; j < productList.length; j++) {
        const { productInfo, quantity, _id } = productList[j];

        console.log('Processing product:', productList[j]); // Log the entire product object for debugging
        console.log('ProductInfo:', productInfo, 'Quantity:', quantity, 'ID:', _id); // Log individual fields

        if (!productInfo || !quantity || !_id) {
          console.log('Skipping invalid product:', productList[j]);  // Log invalid product
          continue; // Skip invalid products
        }

        let tempProduct = { ...productInfo, quantity };
        customerOrderProducts.push(tempProduct);

        if (_id) {
          cardIds.push(_id);
        }

        // Ensure that we are correctly extracting sellerId and price for each product
        const sellerId = products[i].sellerId && products[i].sellerId[j]; // Access sellerId corresponding to the current product
        const sellerPrice = products[i].price && products[i].price[j];   // Access price corresponding to the current product

        console.log('Extracted Seller ID:', sellerId, 'Price:', sellerPrice); // Log seller ID and price

        if (!sellerId || !sellerPrice) {
          console.log(`Missing sellerId or price for product at index ${i}, sellerId: ${sellerId}, price: ${sellerPrice}`);
          return res.status(400).json({ message: 'Missing sellerId or price for one or more products' });
        }

        console.log(`Processing product for sellerId: ${sellerId}, price: ${sellerPrice}`);

        let storeProducts = [];

        for (let k = 0; k < productList.length; k++) {
          const { productInfo, quantity } = productList[k];

          if (!productInfo || !quantity) {
            console.log('Skipping invalid product in storeProducts:', productList[k]);  // Log invalid product
            continue; // Skip invalid products
          }

          let tempProduct = { ...productInfo, quantity };
          storeProducts.push(tempProduct);
        }

        authorOrderData.push({
          orderId: null, // Placeholder for orderId (to be updated later)
          sellerId, // Ensure sellerId is defined
          products: storeProducts,
          price: sellerPrice, // Ensure price is defined
          payment_status: 'unpaid',
          shippingInfo: 'Dhaka Express Warehouse',
          delivery_status: 'pending',
          date: tempDate,
          mpesaCode,
          mpesaName,
          mpesaNumber,
          amount
        });

        console.log(`authorOrderData after pushing product ${i}:${j}:`, authorOrderData);  // Log authorOrderData at each step
      }
    }

    try {
      // Extract all products
      const allProducts = products.flatMap(p => p.products);

      const customerOrderProducts = [];
      const authorOrderData = [];

      allProducts.forEach(product => {
        const productInfo = {
          id: product._id,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
          image: product.image,
          color: product.color,
          stock: product.stock,
          sellerId: product.sellerId
        };

        if (!productInfo.id || !productInfo.name || productInfo.quantity <= 0) {
          console.log('Skipping invalid product:', productInfo);
        } else {
          console.log('Processing product:', productInfo);

          // Push to the respective arrays
          customerOrderProducts.push(productInfo);

          authorOrderData.push({
            orderId: null, // Placeholder
            sellerId: productInfo.sellerId,
            products: [productInfo],
            price: productInfo.price * productInfo.quantity,
            payment_status: 'unpaid',
            shippingInfo: `${shippingInfo.city} Warehouse`,
            delivery_status: 'pending',
            date: new Date().toISOString(),
            mpesaCode,
            mpesaName,
            mpesaNumber,
            amount
          });
        }
      });

      // Proceed with creating the order
      if (customerOrderProducts.length > 0) {
        const order = await customerOrder.create({
          customerId: userId,
          customerEmail,
          mpesaCode,
          mpesaName,
          mpesaNumber,
          amount,
          shipping_fee,
          shippingInfo,
          products: customerOrderProducts,
          price,
          delivery_status: 'pending',
          payment_status: 'unpaid',
          date: new Date().toISOString()
        });

        // Update orderId in authorOrderData
        authorOrderData.forEach(data => {
          data.orderId = order._id;
        });

        const insertedOrders = await authOrderModel.insertMany(authorOrderData);
        console.log('AuthOrders successfully inserted:', insertedOrders);

        res.status(201).json({ message: 'Order placed successfully', orderId: order._id });
      } else {
        console.error('No valid products found to process the order');
        res.status(400).json({ message: 'No valid products found' });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Error placing order', error: error.message });
    }
  },

  // Controller function to get all orders
  getOrders: async (req, res) => {
    try {
      // Fetch all orders from the database
      const orders = await authOrderModel.find().populate('orderId'); // If you want to populate orderId with the CustomerOrder model
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

    // Controller function to get an order by its ID
    getOrderById: async (req, res) => {
      const { id } = req.params;
      try {
        const order = await authOrderModel.findById(id).populate('orderId'); // Populate orderId if necessary
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
      } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    },

  getOrdersByCustomerId: async (req, res) => {
    const { customerId } = req.params;

    try {
      const orders = await customerOrder.find({ customerId }).populate('customerId'); // Populate customerId if necessary
      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this customer' });
      }
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders by customer ID:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Fetch orders by seller ID
getOrdersBySellerId: async (req, res) => {
  try {
    const { sellerId } = req.params; // Seller ID from URL parameters
    const orders = await authOrderModel.find({ sellerId });

    if (!orders) {
      return res.status(404).json({ message: "No orders found for this seller" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching orders." });
  }
}

};


module.exports = orderController;



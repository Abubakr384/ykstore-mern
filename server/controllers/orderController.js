const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
    res.status(400);
    throw new Error('Please provide complete shipping address details');
  }

  // Verify stock and update product inventory
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
      product.stock -= item.quantity;
      await product.save();
    }
  }

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice: taxPrice || 0,
    shippingPrice: shippingPrice || 0,
    totalPrice,
    isPaid: paymentMethod === 'Stripe' || paymentMethod === 'MockOnline' ? true : false,
    paidAt: paymentMethod === 'Stripe' || paymentMethod === 'MockOnline' ? Date.now() : null,
    paymentResult: paymentMethod === 'Stripe' || paymentMethod === 'MockOnline' ? {
      id: 'PAY_MOCK_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      status: 'COMPLETED',
      update_time: new Date().toISOString(),
      email_address: req.user.email
    } : {}
  });

  const createdOrder = await order.save();

  // Clear user cart after successful order creation
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });

  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if user is owner or admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = {
  createOrder,
  getOrderById,
  getMyOrders
};

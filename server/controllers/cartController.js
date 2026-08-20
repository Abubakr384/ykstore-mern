const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to recalculate total cart price
const calculateCartTotal = (items) => {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

// @desc    Get current logged in user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name price images stock category'
  });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      totalPrice: 0
    });
  }

  res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
      totalPrice: 0
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  const addQty = Number(quantity) || 1;

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += addQty;
    cart.items[existingItemIndex].price = product.price;
  } else {
    cart.items.push({
      product: productId,
      quantity: addQty,
      price: product.price
    });
  }

  cart.totalPrice = calculateCartTotal(cart.items);
  await cart.save();

  cart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price images stock category'
  });

  res.json(cart);
});

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { itemId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const itemIndex = cart.items.findIndex((item) => item._id.toString() === itemId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart.totalPrice = calculateCartTotal(cart.items);
    await cart.save();

    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images stock category'
    });

    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
  cart.totalPrice = calculateCartTotal(cart.items);
  await cart.save();

  cart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name price images stock category'
  });

  res.json(cart);
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
  }
  res.json({ message: 'Cart cleared', items: [], totalPrice: 0 });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart
};

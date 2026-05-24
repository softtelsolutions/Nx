const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ msg: 'No order items' });
    }

    // Prepare items for DB and decrement stock quantities
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item._id);
      if (!product) {
        return res.status(404).json({ msg: `Product with id ${item._id} not found` });
      }

      // Decrement product stock if stock exists
      if (product.stock >= (item.quantity || 1)) {
        product.stock -= (item.quantity || 1);
        await product.save();
      } else {
        // Log warning or adjust stock to 0
        product.stock = 0;
        await product.save();
      }

      orderItems.push({
        product: item._id,
        name: item.name,
        priceInr: item.priceInr,
        quantity: item.quantity || 1,
        image: item.image || ''
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
    });

    const createdOrder = await order.save();
    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    return res.status(500).json({ msg: 'Server error during order creation' });
  }
});

// @route   GET /api/orders/user
// @desc    Get logged in user orders
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Fetch user orders error:', error);
    return res.status(500).json({ msg: 'Server error fetching orders' });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email mobile')
      .sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    console.error('Fetch all orders error:', error);
    return res.status(500).json({ msg: 'Server error fetching all orders' });
  }
});

// @route   PUT /api/orders/:id
// @desc    Update order status and/or payment status (Admin only)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: 'Order not found' });
    }

    if (status) {
      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ msg: 'Invalid order status' });
      }
      order.status = status;
    }

    if (paymentStatus) {
      const validPaymentStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return res.status(400).json({ msg: 'Invalid payment status' });
      }
      order.paymentStatus = paymentStatus;
    }

    const updatedOrder = await order.save();
    return res.json(updatedOrder);
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ msg: 'Server error updating order' });
  }
});

module.exports = router;

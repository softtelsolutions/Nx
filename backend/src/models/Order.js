const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        priceInr: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: { 
      type: String, 
      default: 'Pending', 
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] 
    },
    paymentStatus: { 
      type: String, 
      default: 'Pending', 
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'] 
    },
    orderDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

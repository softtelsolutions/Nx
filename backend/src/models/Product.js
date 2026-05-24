const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Electronics',
        'Clothes',
        'Footwear',
        'Home',
        'Beauty',
        'Sports',
        'Books',
        'Others',
      ],
    },
    priceInr: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
    desc: { type: String, default: '' },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    const product =
      (await Product.findOne({ slug: idOrSlug })) ||
      (await Product.findById(idOrSlug).catch(() => null));

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch product' });
  }
});

module.exports = router;

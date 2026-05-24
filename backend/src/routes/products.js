const express = require('express');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Helper to generate unique/clean slug from name
const generateSlug = async (name) => {
  let baseSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/[\s_]+/g, '-')     // Replace spaces/underscores with hyphens
    .replace(/-+/g, '-')         // Remove double hyphens
    .replace(/(^-|-$)/g, '');    // Trim leading/trailing hyphens

  // Ensure uniqueness
  let slug = baseSlug;
  let count = 1;
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }
  return slug;
};

// @route   GET /api/products
// @desc    Get all products (with search & category filtering)
// @access  Public
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

// @route   GET /api/products/:idOrSlug
// @desc    Get single product by ID or Slug
// @access  Public
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

// @route   POST /api/products
// @desc    Create a product (Admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, priceInr, image, desc, stock } = req.body;

    if (!name || !category || !priceInr) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    // Validate category enum
    const validCategories = [
      'Electronics',
      'Clothes',
      'Footwear',
      'Home',
      'Beauty',
      'Sports',
      'Books',
      'Others',
    ];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
    }

    const slug = await generateSlug(name);

    const product = new Product({
      name,
      slug,
      category,
      priceInr,
      image: image || '',
      desc: desc || '',
      stock: stock || 0,
    });

    const createdProduct = await product.save();
    return res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({ message: 'Failed to create product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product (Admin only)
// @access  Private/Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, category, priceInr, image, desc, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If name changed, generate new unique slug
    if (name && name !== product.name) {
      product.name = name;
      product.slug = await generateSlug(name);
    }

    if (category) {
      const validCategories = [
        'Electronics',
        'Clothes',
        'Footwear',
        'Home',
        'Beauty',
        'Sports',
        'Books',
        'Others',
      ];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      product.category = category;
    }

    if (priceInr !== undefined) product.priceInr = priceInr;
    if (image !== undefined) product.image = image;
    if (desc !== undefined) product.desc = desc;
    if (stock !== undefined) product.stock = stock;

    const updatedProduct = await product.save();
    return res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({ message: 'Failed to update product' });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({ message: 'Failed to delete product' });
  }
});

module.exports = router;


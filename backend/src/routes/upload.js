const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only image types
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp|svg\+xml|svg/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  return cb(new Error('Only images (jpeg, jpg, png, webp, svg) are allowed!'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route   POST /api/products/upload
// @desc    Upload product image (Admin only)
// @access  Private/Admin
router.post('/', protect, adminOnly, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'Please select an image file to upload' });
    }

    // Return the relative URL of the uploaded image file
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ 
      msg: 'Image uploaded successfully',
      url: fileUrl 
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({ msg: 'Server error during file upload' });
  }
}, (error, req, res, next) => {
  // Error handler for multer errors or file filter errors
  return res.status(400).json({ msg: error.message });
});

module.exports = router;

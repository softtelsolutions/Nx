require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB } = require('../config/db');
const Product = require('../models/Product');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Helper to write a beautiful SVG placeholder to the uploads directory
const createSvgPlaceholder = (filename, name, bgColor) => {
  const filePath = path.join(uploadDir, filename);
  
  // Clean special characters from product name to show nicely
  const displayName = name.length > 22 ? name.substring(0, 20) + '...' : name;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
    <rect width="400" height="400" fill="${bgColor}" />
    <circle cx="200" cy="200" r="120" fill="#ffffff" opacity="0.15" />
    
    <!-- Bag / Box icon drawn with SVG -->
    <path d="M160 160 C 160 110, 240 110, 240 160" stroke="#ffffff" stroke-width="8" fill="none" opacity="0.8" />
    <rect x="140" y="160" width="120" height="100" rx="15" fill="#ffffff" opacity="0.9" />
    
    <!-- Text contents -->
    <text x="50%" y="320" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" fill="#ffffff">${displayName}</text>
    <text x="50%" y="350" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" fill="#ffffff" opacity="0.6">PREMIUM RETAIL</text>
  </svg>`;
  
  fs.writeFileSync(filePath, svg);
  console.log(`Generated local asset: ${filename}`);
};

const products = [
  { name: 'Noise-Cancelling Headphones', slug: 'noise-cancelling-headphones', category: 'Electronics', priceInr: 6999, stock: 30, image: '/uploads/headphones.svg', desc: 'Wireless over-ear headphones with deep bass and long battery life.', bgColor: '#3B82F6' },
  { name: 'Smart Fitness Watch', slug: 'smart-fitness-watch', category: 'Electronics', priceInr: 4999, stock: 40, image: '/uploads/watch.svg', desc: 'Track heart rate, sleep, and daily workouts with AMOLED display.', bgColor: '#EF4444' },
  { name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', category: 'Electronics', priceInr: 2499, stock: 55, image: '/uploads/speaker.svg', desc: 'Compact speaker with strong sound and 12-hour battery backup.', bgColor: '#10B981' },
  { name: 'Men Casual Shirt', slug: 'men-casual-shirt', category: 'Clothes', priceInr: 1299, stock: 60, image: '/uploads/shirt-men.svg', desc: 'Breathable cotton shirt for everyday office and casual wear.', bgColor: '#F59E0B' },
  { name: 'Women Summer Dress', slug: 'women-summer-dress', category: 'Clothes', priceInr: 1899, stock: 45, image: '/uploads/dress-women.svg', desc: 'Lightweight floral dress with soft fabric and modern fit.', bgColor: '#EC4899' },
  { name: 'Unisex Hoodie', slug: 'unisex-hoodie', category: 'Clothes', priceInr: 1799, stock: 35, image: '/uploads/hoodie.svg', desc: 'Premium fleece hoodie suitable for all seasons.', bgColor: '#6366F1' },
  { name: 'Running Shoes', slug: 'running-shoes', category: 'Footwear', priceInr: 3299, stock: 50, image: '/uploads/running-shoes.svg', desc: 'Cushioned sole and breathable upper for long-distance comfort.', bgColor: '#8B5CF6' },
  { name: 'Leather Formal Shoes', slug: 'leather-formal-shoes', category: 'Footwear', priceInr: 3999, stock: 28, image: '/uploads/formal-shoes.svg', desc: 'Elegant formal shoes made with genuine leather finish.', bgColor: '#14B8A6' },
  { name: 'Casual Sneakers', slug: 'casual-sneakers', category: 'Footwear', priceInr: 2799, stock: 42, image: '/uploads/sneakers.svg', desc: 'Everyday sneakers with lightweight grip and stylish profile.', bgColor: '#6B7280' },
  { name: 'Non-Stick Cookware Set', slug: 'non-stick-cookware-set', category: 'Home', priceInr: 3599, stock: 20, image: '/uploads/cookware.svg', desc: 'Durable 5-piece cookware set for modern kitchens.', bgColor: '#06B6D4' },
  { name: 'Premium Bed Sheet Set', slug: 'premium-bed-sheet-set', category: 'Home', priceInr: 1599, stock: 38, image: '/uploads/bedsheet.svg', desc: 'Soft cotton blend bed sheet with two pillow covers.', bgColor: '#F43F5E' },
  { name: 'LED Table Lamp', slug: 'led-table-lamp', category: 'Home', priceInr: 999, stock: 70, image: '/uploads/table-lamp.svg', desc: 'Eye-care LED lamp with adjustable brightness levels.', bgColor: '#F59E0B' },
  { name: 'Vitamin C Face Serum', slug: 'vitamin-c-face-serum', category: 'Beauty', priceInr: 749, stock: 80, image: '/uploads/face-serum.svg', desc: 'Brightening serum for daily skincare routine.', bgColor: '#10B981' },
  { name: 'Herbal Shampoo', slug: 'herbal-shampoo', category: 'Beauty', priceInr: 499, stock: 95, image: '/uploads/shampoo.svg', desc: 'Sulfate-free herbal shampoo for healthy, smooth hair.', bgColor: '#3B82F6' },
  { name: 'Matte Lipstick Combo', slug: 'matte-lipstick-combo', category: 'Beauty', priceInr: 899, stock: 75, image: '/uploads/lipstick.svg', desc: 'Long-lasting matte shades for day and evening looks.', bgColor: '#EC4899' },
  { name: 'Yoga Mat', slug: 'yoga-mat', category: 'Sports', priceInr: 1299, stock: 48, image: '/uploads/yoga-mat.svg', desc: 'Anti-slip yoga mat with extra cushioning support.', bgColor: '#14B8A6' },
  { name: 'Cricket Bat (English Willow)', slug: 'cricket-bat-english-willow', category: 'Sports', priceInr: 4499, stock: 18, image: '/uploads/cricket-bat.svg', desc: 'Balanced blade with excellent pickup for match play.', bgColor: '#8B5CF6' },
  { name: 'Adjustable Dumbbell Pair', slug: 'adjustable-dumbbell-pair', category: 'Sports', priceInr: 5999, stock: 22, image: '/uploads/dumbbells.svg', desc: 'Space-saving adjustable dumbbells for home workouts.', bgColor: '#374151' },
  { name: 'Atomic Habits', slug: 'atomic-habits', category: 'Books', priceInr: 499, stock: 120, image: '/uploads/atomic-habits.svg', desc: 'Bestselling self-improvement book on building good habits.', bgColor: '#EC4899' },
  { name: 'Minimalist Leather Wallet', slug: 'minimalist-leather-wallet', category: 'Others', priceInr: 1099, stock: 65, image: '/uploads/wallet.svg', desc: 'Slim wallet with RFID protection and multiple card slots.', bgColor: '#B45309' },
];

async function seed() {
  try {
    console.log('Generating beautiful local vector product images...');
    products.forEach((p) => {
      const filename = path.basename(p.image);
      createSvgPlaceholder(filename, p.name, p.bgColor);
    });

    console.log('Connecting to database...');
    await connectDB();

    console.log('Cleaning old products...');
    await Product.deleteMany({});

    console.log('Inserting seed products...');
    // Map products to remove bgColor before DB insertion
    const dbProducts = products.map(({ bgColor, ...rest }) => rest);
    await Product.insertMany(dbProducts);

    console.log(`Successfully seeded ${products.length} products with high-quality local assets!`);
    process.exit(0);
  } catch (error) {
    console.error('Product seed failed:', error);
    process.exit(1);
  }
}

seed();


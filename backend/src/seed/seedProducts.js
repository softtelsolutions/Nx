require('dotenv').config();
const { connectDB } = require('../config/db');
const Product = require('../models/Product');

const products = [
  { name: 'Noise-Cancelling Headphones', slug: 'noise-cancelling-headphones', category: 'Electronics', priceInr: 6999, stock: 30, image: '/images/headphones.jpg', desc: 'Wireless over-ear headphones with deep bass and long battery life.' },
  { name: 'Smart Fitness Watch', slug: 'smart-fitness-watch', category: 'Electronics', priceInr: 4999, stock: 40, image: '/images/watch.jpg', desc: 'Track heart rate, sleep, and daily workouts with AMOLED display.' },
  { name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', category: 'Electronics', priceInr: 2499, stock: 55, image: '/images/speaker.jpg', desc: 'Compact speaker with strong sound and 12-hour battery backup.' },
  { name: 'Men Casual Shirt', slug: 'men-casual-shirt', category: 'Clothes', priceInr: 1299, stock: 60, image: '/images/shirt-men.jpg', desc: 'Breathable cotton shirt for everyday office and casual wear.' },
  { name: 'Women Summer Dress', slug: 'women-summer-dress', category: 'Clothes', priceInr: 1899, stock: 45, image: '/images/dress-women.jpg', desc: 'Lightweight floral dress with soft fabric and modern fit.' },
  { name: 'Unisex Hoodie', slug: 'unisex-hoodie', category: 'Clothes', priceInr: 1799, stock: 35, image: '/images/hoodie.jpg', desc: 'Premium fleece hoodie suitable for all seasons.' },
  { name: 'Running Shoes', slug: 'running-shoes', category: 'Footwear', priceInr: 3299, stock: 50, image: '/images/running-shoes.jpg', desc: 'Cushioned sole and breathable upper for long-distance comfort.' },
  { name: 'Leather Formal Shoes', slug: 'leather-formal-shoes', category: 'Footwear', priceInr: 3999, stock: 28, image: '/images/formal-shoes.jpg', desc: 'Elegant formal shoes made with genuine leather finish.' },
  { name: 'Casual Sneakers', slug: 'casual-sneakers', category: 'Footwear', priceInr: 2799, stock: 42, image: '/images/sneakers.jpg', desc: 'Everyday sneakers with lightweight grip and stylish profile.' },
  { name: 'Non-Stick Cookware Set', slug: 'non-stick-cookware-set', category: 'Home', priceInr: 3599, stock: 20, image: '/images/cookware.jpg', desc: 'Durable 5-piece cookware set for modern kitchens.' },
  { name: 'Premium Bed Sheet Set', slug: 'premium-bed-sheet-set', category: 'Home', priceInr: 1599, stock: 38, image: '/images/bedsheet.jpg', desc: 'Soft cotton blend bed sheet with two pillow covers.' },
  { name: 'LED Table Lamp', slug: 'led-table-lamp', category: 'Home', priceInr: 999, stock: 70, image: '/images/table-lamp.jpg', desc: 'Eye-care LED lamp with adjustable brightness levels.' },
  { name: 'Vitamin C Face Serum', slug: 'vitamin-c-face-serum', category: 'Beauty', priceInr: 749, stock: 80, image: '/images/face-serum.jpg', desc: 'Brightening serum for daily skincare routine.' },
  { name: 'Herbal Shampoo', slug: 'herbal-shampoo', category: 'Beauty', priceInr: 499, stock: 95, image: '/images/shampoo.jpg', desc: 'Sulfate-free herbal shampoo for healthy, smooth hair.' },
  { name: 'Matte Lipstick Combo', slug: 'matte-lipstick-combo', category: 'Beauty', priceInr: 899, stock: 75, image: '/images/lipstick.jpg', desc: 'Long-lasting matte shades for day and evening looks.' },
  { name: 'Yoga Mat', slug: 'yoga-mat', category: 'Sports', priceInr: 1299, stock: 48, image: '/images/yoga-mat.jpg', desc: 'Anti-slip yoga mat with extra cushioning support.' },
  { name: 'Cricket Bat (English Willow)', slug: 'cricket-bat-english-willow', category: 'Sports', priceInr: 4499, stock: 18, image: '/images/cricket-bat.jpg', desc: 'Balanced blade with excellent pickup for match play.' },
  { name: 'Adjustable Dumbbell Pair', slug: 'adjustable-dumbbell-pair', category: 'Sports', priceInr: 5999, stock: 22, image: '/images/dumbbells.jpg', desc: 'Space-saving adjustable dumbbells for home workouts.' },
  { name: 'Atomic Habits', slug: 'atomic-habits', category: 'Books', priceInr: 499, stock: 120, image: '/images/atomic-habits.jpg', desc: 'Bestselling self-improvement book on building good habits.' },
  { name: 'Minimalist Leather Wallet', slug: 'minimalist-leather-wallet', category: 'Others', priceInr: 1099, stock: 65, image: '/images/wallet.jpg', desc: 'Slim wallet with RFID protection and multiple card slots.' },
];

async function seed() {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products with INR prices.`);
    process.exit(0);
  } catch (error) {
    console.error('Product seed failed:', error);
    process.exit(1);
  }
}

seed();

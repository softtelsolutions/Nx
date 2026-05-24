require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const productRoutes = require('./routes/products');

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = [
        process.env.CLIENT_ORIGIN,
        'http://localhost:4200',
        'http://localhost:4300',
        'http://localhost:3000',
      ].filter(Boolean);

      if (!origin || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'retail-backend' });
});

app.use('/api/products', productRoutes);

const port = Number(process.env.PORT || 5000);

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

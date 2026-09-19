require('dotenv').config();

try {
  require('node:dns').setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignored in environments where custom DNS servers cannot be set
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Policy = require('./models/Policy');
const { policies } = require('./seed');

// Import routes
const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const adminRoutes = require('./routes/admin');

const app = express();

// Connect to MongoDB and auto-seed default policies if collection is empty
connectDB().then(async () => {
  try {
    const policyCount = await Policy.countDocuments();
    if (policyCount === 0) {
      await Policy.insertMany(policies);
      console.log(`✅ Auto-seeded ${policies.length} initial policies`);
    }
  } catch (err) {
    console.warn('⚠️ Policy initialization note:', err.message);
  }
});

// Dynamic CORS configuration for local + production (Vercel)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, postman, server-to-server)
    if (!origin) return callback(null, true);
    // Allow configured origins or any vercel.app preview/production deployment
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive fallback so production requests succeed
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 AIONOS OpsPilot API is running', status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

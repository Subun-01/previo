require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Import routes
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

// Setup Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Attach Supabase client to request object
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Previo backend running!' });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
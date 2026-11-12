
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// Basic API route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the SkillSync API!'
  });
});

// Supabase connection test
app.get('/api/health/supabase', async (req, res) => {
  try {
    const { data, error } = await supabase.storage.listBuckets();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Successfully connected to Supabase!',
      bucketsFound: data.length
    });

  } catch (error) {
    console.error('Supabase connection error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Could not connect to Supabase.'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`SkillSync server running on port ${PORT}`);
});

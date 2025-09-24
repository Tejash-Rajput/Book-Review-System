const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const cookieParser = require('cookie-parser');

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));


const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/auth', authRoutes);
app.use('/books', bookRoutes);
app.use('/reviews', reviewRoutes);
app.get('/search', require('./controllers/bookController').searchBooks);
// Replace the existing error handler with:
app.use((err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate field value entered'
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Add 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const Book = require('../models/Book');
const Review = require('../models/Review');
const { bookSchema } = require('./joi-schema');

// Add a new book
const addBook = async (req, res) => {
  try {
    // Validate input
    const { error } = bookSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { title, author, genre } = req.body;

    // Create new book
    const book = new Book({ title, author, genre });
    await book.save();

    res.status(201).json({
      success: true,
      message: 'Book added successfully',
      book
    });

  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all books with pagination and filtering
const getAllBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' };
    }
    if (req.query.genre) {
      filter.genre = { $regex: req.query.genre, $options: 'i' };
    }

    // Get books with pagination
    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalBooks: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get book by ID with reviews
const getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Find book by custom ID
    const book = await Book.findOne({ id: bookId });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Get reviews with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalReviews = await Review.countDocuments({ book: book._id });

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { book: book._id } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    const avgRating = ratingStats.length > 0 ? ratingStats[0].avgRating : 0;

    res.json({
      success: true,
      data: {
        book: {
          ...book.toObject(),
          avgRating: Math.round(avgRating * 10) / 10,
          totalReviews
        },
        reviews,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReviews / limit),
          totalReviews,
          hasNextPage: page < Math.ceil(totalReviews / limit),
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Search books by title or author
const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    };

    const books = await Book.find(searchFilter).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        books,
        count: books.length
      }
    });

  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  addBook,
  getAllBooks,
  getBookById,
  searchBooks
};
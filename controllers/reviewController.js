const Review = require('../models/Review');
const Book = require('../models/Book');
const { reviewSchema } = require('./joi-schema');

// Add a review to a book
const addReview = async (req, res) => {
  try {
    // Validate input
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { rating, comment } = req.body;
    const bookId = req.params.id;
    const userId = req.user.userId;

    // Find book by custom ID
    const book = await Book.findOne({ id: bookId });
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      user: userId,
      book: book._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    // Create new review
    const review = new Review({
      user: userId,
      book: book._id,
      rating,
      comment
    });

    await review.save();

    // Add review to book's reviews array
    book.reviews.push(review._id);
    await book.save();

    // Populate user info in response
    await review.populate('user', 'username');

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    // Validate input
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { rating, comment } = req.body;
    const reviewId = req.params.id;
    const userId = req.user.userId;

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own reviews'
      });
    }

    // Update review
    review.rating = rating;
    review.comment = comment;
    await review.save();

    await review.populate('user', 'username');

    res.json({
      success: true,
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.userId;

    // Find review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own reviews'
      });
    }

    // Remove review from book's reviews array
    await Book.findByIdAndUpdate(review.book, {
      $pull: { reviews: reviewId }
    });

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  addReview,
  updateReview,
  deleteReview
};
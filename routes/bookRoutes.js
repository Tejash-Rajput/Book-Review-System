const express = require('express');
const { addBook, getAllBooks, getBookById } = require('../controllers/bookController');
const { addReview } = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', authenticateToken, addBook);
router.post('/:id/reviews', authenticateToken, addReview);

module.exports = router;
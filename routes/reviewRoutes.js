const express = require('express');
const { updateReview, deleteReview } = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

module.exports = router;
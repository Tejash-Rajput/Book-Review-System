const mongoose = require('mongoose');

mongoose.connect(process.env.DB);

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  rating: { type: Number, min: 1, max: 5 , required: true },
  comment: { type: String, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);

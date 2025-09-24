const mongoose = require('mongoose');

mongoose.connect(process.env.DB);

const bookSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

bookSchema.index({ id: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);

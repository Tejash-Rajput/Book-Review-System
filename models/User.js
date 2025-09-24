const mongoose = require('mongoose');

mongoose.connect(process.env.DB);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

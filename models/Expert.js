const mongoose = require('mongoose');

const ExpertSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  experience: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  // optional: timezone, bio, etc.
});

module.exports = mongoose.model('Expert', ExpertSchema);

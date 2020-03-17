const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipeId: {
    type: Number,
    required: true
  },
  dateOfEvent: {
    type: String,
    required: true
  },
  notes: {
    type: [String],
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Event', schema);

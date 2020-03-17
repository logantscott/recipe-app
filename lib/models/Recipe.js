const mongoose = require('mongoose');

const ingredientsSchema = new mongoose.Schema({
  ingredient: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true,
    enum: ['tsp', 'tbsp', 'cup', 'pinch', 'oz', 'pt', 'qt', 'gal', 'fl oz']
  }
});

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  directions: [String],
  ingredients: [ingredientsSchema]
});

module.exports = mongoose.model('Recipe', schema);

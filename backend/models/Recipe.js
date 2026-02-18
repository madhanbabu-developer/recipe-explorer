const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  cuisine: String,
  title: String,
  rating: Number,
  prep_time: Number,
  cook_time: Number,
  total_time: Number,
  description: String,

  url: String,   // ✅ ADD THIS LINE

  nutrients: {
    calories: Number,
    carbs: Number,
    protein: Number,
    fat: Number,
    sugar: Number,
    sodium: Number,
    fiber: Number,
    cholesterol: Number
  },

  serves: String
});

module.exports = mongoose.model("Recipe", recipeSchema);

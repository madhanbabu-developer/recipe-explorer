const Recipe = require("../models/Recipe");

exports.getRecipes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Recipe.countDocuments();

  const recipes = await Recipe.find()
    .sort({ rating: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    page,
    total,
    totalPages: Math.ceil(total / limit),
    data: recipes
  });
};

exports.searchRecipes = async (req, res) => {
  let filter = {};

  if (req.query.title) {
    filter.title = { $regex: req.query.title, $options: "i" };
  }

  if (req.query.cuisine) {
    filter.cuisine = req.query.cuisine;
  }

  if (req.query.rating) {
    filter.rating = { $gte: Number(req.query.rating) };
  }

  if (req.query.calories) {
    filter["nutrients.calories"] = { $lte: Number(req.query.calories) };
  }

  const results = await Recipe.find(filter);

  res.json(results);
};

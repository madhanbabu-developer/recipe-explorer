const Recipe = require("../models/Recipe");
const axios = require("axios");
const cheerio = require("cheerio");

const imageCache = {};

// 1. Get all recipes in a paginated and sorted manner
exports.getRecipes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "title";
    const order = req.query.order === "desc" ? -1 : 1;
    const sortOption = { [sortField]: order };

    const total = await Recipe.countDocuments();
    const recipes = await Recipe.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: recipes
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. Search for recipes based on various fields (with pagination/sorting for the frontend)
exports.searchRecipes = async (req, res) => {
  try {
    const filter = {};

    // Search fields
    if (req.query.name || req.query.title) {
      const searchTitle = req.query.name || req.query.title;
      filter.title = { $regex: searchTitle, $options: "i" };
    }
    if (req.query.cuisine) {
      filter.cuisine = { $regex: req.query.cuisine, $options: "i" };
    }
    if (req.query.rating) {
      filter.rating = { $gte: Number(req.query.rating) };
    }
    if (req.query.calories) {
      filter["nutrients.calories"] = { $lte: Number(req.query.calories) };
    }
    if (req.query.total_time) {
      filter.total_time = { $lte: Number(req.query.total_time) };
    }

    // Pagination & Sorting (Also useful for search results)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "title";
    const order = req.query.order === "desc" ? -1 : 1;
    const sortOption = { [sortField]: order };

    const total = await Recipe.countDocuments(filter);
    const recipes = await Recipe.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: recipes,
      recipes: recipes // Kept for frontend backwards compatibility
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. Scrape exact image from AllRecipes URL and redirect
exports.scrapeImage = async (req, res) => {
  const url = req.query.url;
  const placeholderUrl = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=600&q=80";

  if (!url) {
    return res.redirect(placeholderUrl);
  }

  // Use simple in-memory cache to avoid rate limiting
  if (imageCache[url]) {
    if (imageCache[url] === 'FAILED') return res.redirect(placeholderUrl);
    return res.redirect(imageCache[url]);
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }
    });

    const $ = cheerio.load(response.data);
    let imageUrl = $('meta[property="og:image"]').attr('content') || $('.primary-image').attr('src');

    if (imageUrl) {
      imageCache[url] = imageUrl;
      return res.redirect(imageUrl);
    } else {
      imageCache[url] = 'FAILED';
      return res.redirect(placeholderUrl);
    }
  } catch (err) {
    imageCache[url] = 'FAILED';
    return res.redirect(placeholderUrl);
  }
};

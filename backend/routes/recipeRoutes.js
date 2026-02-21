const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Route 1: Get all recipes in a paginated and sorted manner
router.get("/all", recipeController.getRecipes);

// Route 2: Search for recipes based on various fields
// (Also mounted on "/" to preserve frontend functionality which relies on /api/recipes?name=...)
router.get("/search", recipeController.searchRecipes);
router.get("/", recipeController.searchRecipes);
router.get("/image", recipeController.scrapeImage);

module.exports = router;

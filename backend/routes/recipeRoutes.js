const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");

// 🔎 Search Recipe By Name
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "title";
    const order = req.query.order === "desc" ? -1 : 1;

    const search = req.query.name || "";

    const sortOption = {};
    sortOption[sortField] = order;

    // 🔎 Build Search Filter
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const total = await Recipe.countDocuments(filter);

    const recipes = await Recipe.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      recipes,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;

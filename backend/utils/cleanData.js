const parseNumber = (value) => {
  if (!value || value === "NaN") return null;
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
};

const cleanRecipe = (r) => {
  return {
    cuisine: r.cuisine || null,
    title: r.title || null,
    rating: parseNumber(r.rating),
    prep_time: parseNumber(r.prep_time),
    cook_time: parseNumber(r.cook_time),
    total_time: parseNumber(r.total_time),
    description: r.description || null,

    // ✅ ADD THIS LINE
    url: r.URL || null,

    nutrients: {
      calories: parseNumber(r.nutrients?.calories),
      carbs: parseNumber(r.nutrients?.carbohydrateContent),
      protein: parseNumber(r.nutrients?.proteinContent),
      fat: parseNumber(r.nutrients?.fatContent),
      sugar: parseNumber(r.nutrients?.sugarContent),
      sodium: parseNumber(r.nutrients?.sodiumContent),
      fiber: parseNumber(r.nutrients?.fiberContent),
      cholesterol: parseNumber(r.nutrients?.cholesterolContent),
    },
    serves: r.serves || null
  };
};

module.exports = { cleanRecipe };

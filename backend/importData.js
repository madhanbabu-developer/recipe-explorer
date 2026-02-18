const fs = require("fs");
const connectDB = require("./config/db");
const Recipe = require("./models/Recipe");
const { cleanRecipe } = require("./utils/cleanData");

const importData = async () => {
  try {
    await connectDB();

    const data = JSON.parse(
      fs.readFileSync("US_recipes_null.json", "utf-8")
    );

    const recipesArray = Array.isArray(data)
      ? data
      : Object.values(data);

    await Recipe.deleteMany();

    const cleaned = recipesArray.map(cleanRecipe);

    await Recipe.insertMany(cleaned);

    console.log("Data Imported Successfully ✅");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

importData();

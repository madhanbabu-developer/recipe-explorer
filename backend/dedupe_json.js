const fs = require('fs');

console.log("Reading US_recipes_null.json...");
const rawData = fs.readFileSync('US_recipes_null.json', 'utf-8');
const data = JSON.parse(rawData);

console.log(`Original count: ${data.length}`);

// Use a Set to track seen recipe titles (and maybe URLs) to ensure absolute uniqueness
const seen = new Set();
const uniqueRecipes = [];

for (const recipe of data) {
    // Create a unique key based on the title (lowercase to avoid case sensitivity dupes)
    // and the URL, as sometimes variations of recipes exist but pointing to the same article
    const key1 = recipe.title ? recipe.title.toLowerCase().trim() : "";
    const key2 = recipe.url || recipe.URL || "";

    const compositeKey = `${key1}|${key2}`;

    if (!seen.has(compositeKey)) {
        seen.add(compositeKey);
        uniqueRecipes.push(recipe);
    }
}

console.log(`Unique count: ${uniqueRecipes.length}`);
console.log(`Removed ${data.length - uniqueRecipes.length} duplicates.`);

console.log("Writing deduped data to US_recipes_null.json...");
fs.writeFileSync('US_recipes_null.json', JSON.stringify(uniqueRecipes, null, 2));
console.log("Done!");

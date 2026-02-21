const fs = require('fs');

console.log("Reading US_recipes_null.json...");
const rawData = fs.readFileSync('US_recipes_null.json', 'utf-8');
let data;
try {
    data = JSON.parse(rawData);
} catch (e) {
    console.error("JSON parse error:", e);
    process.exit(1);
}

function cleanValue(val) {
    if (val === "NaN" || val === "N/A" || (typeof val === 'number' && isNaN(val))) {
        return null;
    }
    if (Array.isArray(val)) {
        return val.map(cleanValue);
    }
    if (typeof val === 'object' && val !== null) {
        const cleaned = {};
        for (const [k, v] of Object.entries(val)) {
            const cv = cleanValue(v);
            if (cv !== null) {
                cleaned[k] = cv;
            }
        }
        return cleaned;
    }
    return val;
}

console.log("Cleaning data...");
let recipesArray = Array.isArray(data) ? data : Object.values(data);
let cleanedData = recipesArray.map(cleanValue);

const initialCount = cleanedData.length;

// Filter out recipes missing title, rating, or total_time
cleanedData = cleanedData.filter(recipe => {
    // Check title
    if (!recipe.title || !recipe.title.trim()) return false;
    // Check rating 
    if (recipe.rating === undefined || recipe.rating === null) return false;
    // Check time
    if (recipe.total_time === undefined || recipe.total_time === null) return false;
    return true;
});

const removedCount = initialCount - cleanedData.length;
console.log(`Filtered out ${removedCount} incomplete recipes out of ${initialCount}. Remaining: ${cleanedData.length}`);

console.log("Writing back to US_recipes_null.json...");
fs.writeFileSync('US_recipes_null.json', JSON.stringify(cleanedData, null, 2));
console.log("Cleaning complete!");

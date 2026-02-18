 Schema Explanation

In your README include:

## Database Schema (MongoDB)

Collection: recipes

{
  cuisine: String,
  title: String,
  rating: Number,
  prep_time: Number,
  cook_time: Number,
  total_time: Number,
  description: String,
  url: String,
  serves: String,
  nutrients: {
    calories: Number,
    carbs: Number,
    protein: Number,
    fat: Number,
    sugar: Number,
    sodium: Number,
    fiber: Number,
    cholesterol: Number
  }
}




API Endpoints
Get All Recipes (Paginated)
GET /api/recipes?page=1&limit=10


Response:

{
  "recipes": [...],
  "totalPages": 50,
  "currentPage": 1
}

Sort Recipes
GET /api/recipes?sort=rating&order=desc

Search Recipes
GET /api/recipes?name=chicken

Combined Example
GET /api/recipes?page=1&limit=10&sort=rating&order=desc&name=chicken

How To Test API

You can test using:

Postman

Thunder Client (VS Code)

Browser (for GET requests)

Example:

http://localhost:5000/api/recipes?sort=rating&order=desc

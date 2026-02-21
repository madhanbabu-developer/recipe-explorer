-- Database Design Schema for Recipe Data
-- Based on the assessment requirements

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    cuisine VARCHAR,
    title VARCHAR,
    rating FLOAT,
    prep_time INT,
    cook_time INT,
    total_time INT,
    description TEXT,
    nutrients JSONB,
    serves VARCHAR,
    
    -- Additional fields extracted from JSON for frontend usage
    url VARCHAR,
    ingredients JSONB,
    instructions JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note on Handling NaN Values: 
-- Before inserting the JSON data into this table, numeric fields 
-- (rating, prep_time, cook_time, total_time) containing "NaN" 
-- should be parsed and converted to NULL to comply with standard SQL types.

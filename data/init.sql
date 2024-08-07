CREATE TABLE companies (
    company_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    address VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT
);

CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(company_id),
    name VARCHAR(255),
    address VARCHAR(255),
    latitude FLOAT,
    longitude FLOAT
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
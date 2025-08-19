# Project Repository

This repository contains a fullstack food delivery application.

## Backend API Overview

Key endpoints (see /docs for full OpenAPI):
- Auth: POST /auth/register, POST /auth/login, GET /auth/me
- Restaurants: GET /restaurants, GET /restaurants/{id}, GET /restaurants/{id}/menu
- Cart: GET /cart, POST /cart/items, PUT /cart/items/{itemId}, DELETE /cart/items/{itemId}, POST /cart/clear, POST /cart/checkout
- Orders: GET /orders, GET /orders/{id}, PATCH /orders/{id}/status
- Profile: GET /profile, PUT /profile

Use Authorization: Bearer <token> for protected routes.

## Backend Database Setup

The backend uses Sequelize ORM with PostgreSQL by default. You can switch to another dialect by changing `DB_DIALECT` and corresponding driver packages.

### Environment variables
Copy `food_delivery_backend/.env.example` to `food_delivery_backend/.env` and fill the values:
- DB_DIALECT=postgres
- DB_HOST=localhost
- DB_PORT=5432
- DB_NAME=food_delivery
- DB_USER=postgres
- DB_PASSWORD=your_password
- DB_SYNC=true (local development only; use migrations in production)

### Install dependencies
From `food_delivery_backend/`:
- npm install

If using Postgres, `pg` and `pg-hstore` are already listed. For MySQL or MariaDB, install `mysql2`. For SQLite, install `sqlite3`.

### Run locally
- npm run dev
- Visit /docs for API docs and /db/health for database connectivity status.

### Models and Relations
- Users (1:1) UserProfile
- Restaurant (1:N) MenuItem
- User (1:N) Order
- Restaurant (1:N) Order
- Order (1:N) OrderItem
- Order (1:N) OrderHistory
- User (as actor) (1:N) OrderHistory

This serves as the foundation for further business logic and endpoints.
'use strict';
/**
 * Database configuration loader. Uses environment variables to configure Sequelize connection.
 * Supported dialects: postgres, mysql, mariadb, sqlite, mssql (via Sequelize).
 *
 * ENV variables required (provide via .env):
 * - DB_DIALECT: e.g., 'postgres'
 * - DB_HOST: database host
 * - DB_PORT: port number
 * - DB_NAME: database name
 * - DB_USER: username
 * - DB_PASSWORD: password
 * - DB_LOGGING: 'true' to enable SQL logging (optional)
 *
 * Note: Do not commit actual credentials. Provide a .env file at runtime.
 */

const requiredVars = ['DB_DIALECT', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];

function validateEnv() {
  const missing = requiredVars.filter((k) => !process.env[k]);
  if (missing.length) {
    // We do not throw to allow the app to start (e.g., for docs/health),
    // but Sequelize init will fail until variables are provided.
    // Log a clear warning for the operator.
    console.warn(
      `[DB CONFIG] Missing environment variables: ${missing.join(
        ', '
      )}. Database connection will fail until these are provided.`
    );
  }
}

validateEnv();

module.exports = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'food_delivery',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: (process.env.DB_LOGGING || 'false').toLowerCase() === 'true' ? console.log : false,
  pool: {
    max: Number(process.env.DB_POOL_MAX || 10),
    min: Number(process.env.DB_POOL_MIN || 0),
    acquire: Number(process.env.DB_POOL_ACQUIRE || 30000),
    idle: Number(process.env.DB_POOL_IDLE || 10000),
  },
};

'use strict';
/**
 * Initializes Sequelize, loads models, defines associations, and exposes a sync helper.
 *
 * PUBLIC_INTERFACE
 * function getDb() - returns the db object containing sequelize, Sequelize classes, and initialized models.
 */

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

// Instantiate Sequelize
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
    pool: config.pool,
    define: {
      underscored: true, // snake_case columns
      timestamps: true,  // created_at, updated_at
    },
  }
);

// Models loader
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import model definers
db.User = require('./user')(sequelize, DataTypes);
db.UserProfile = require('./userProfile')(sequelize, DataTypes);
db.Restaurant = require('./restaurant')(sequelize, DataTypes);
db.MenuItem = require('./menuItem')(sequelize, DataTypes);
db.Order = require('./order')(sequelize, DataTypes);
db.OrderItem = require('./orderItem')(sequelize, DataTypes);
db.OrderHistory = require('./orderHistory')(sequelize, DataTypes);

// Associations
function applyAssociations() {
  // User -> UserProfile (1:1)
  db.User.hasOne(db.UserProfile, { foreignKey: { name: 'user_id', allowNull: false }, as: 'profile', onDelete: 'CASCADE' });
  db.UserProfile.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false }, as: 'user' });

  // Restaurant -> MenuItem (1:N)
  db.Restaurant.hasMany(db.MenuItem, { foreignKey: { name: 'restaurant_id', allowNull: false }, as: 'menuItems', onDelete: 'CASCADE' });
  db.MenuItem.belongsTo(db.Restaurant, { foreignKey: { name: 'restaurant_id', allowNull: false }, as: 'restaurant' });

  // User -> Order (1:N) as customer
  db.User.hasMany(db.Order, { foreignKey: { name: 'user_id', allowNull: false }, as: 'orders' });
  db.Order.belongsTo(db.User, { foreignKey: { name: 'user_id', allowNull: false }, as: 'user' });

  // Restaurant -> Order (1:N)
  db.Restaurant.hasMany(db.Order, { foreignKey: { name: 'restaurant_id', allowNull: false }, as: 'orders' });
  db.Order.belongsTo(db.Restaurant, { foreignKey: { name: 'restaurant_id', allowNull: false }, as: 'restaurant' });

  // Order -> OrderItem (1:N)
  db.Order.hasMany(db.OrderItem, { foreignKey: { name: 'order_id', allowNull: false }, as: 'items', onDelete: 'CASCADE' });
  db.OrderItem.belongsTo(db.Order, { foreignKey: { name: 'order_id', allowNull: false }, as: 'order' });

  // MenuItem -> OrderItem (1:N)
  db.MenuItem.hasMany(db.OrderItem, { foreignKey: { name: 'menu_item_id', allowNull: false }, as: 'orderItems' });
  db.OrderItem.belongsTo(db.MenuItem, { foreignKey: { name: 'menu_item_id', allowNull: false }, as: 'menuItem' });

  // Order -> OrderHistory (1:N)
  db.Order.hasMany(db.OrderHistory, { foreignKey: { name: 'order_id', allowNull: false }, as: 'history', onDelete: 'CASCADE' });
  db.OrderHistory.belongsTo(db.Order, { foreignKey: { name: 'order_id', allowNull: false }, as: 'order' });

  // User (as actor) -> OrderHistory (1:N)
  db.User.hasMany(db.OrderHistory, { foreignKey: { name: 'actor_user_id', allowNull: true }, as: 'actions' });
  db.OrderHistory.belongsTo(db.User, { foreignKey: { name: 'actor_user_id', allowNull: true }, as: 'actor' });
}

applyAssociations();

/**
 * PUBLIC_INTERFACE
 * Initialize and synchronize DB schema.
 * Use cautiously in production (migrations preferred). Controlled via DB_SYNC env var.
 */
async function syncDatabase() {
  const shouldSync = (process.env.DB_SYNC || 'false').toLowerCase() === 'true';
  if (!shouldSync) return;
  const force = (process.env.DB_SYNC_FORCE || 'false').toLowerCase() === 'true';
  await db.sequelize.sync({ alter: !force && true, force });
  console.log(`[DB] Sync completed. Options => force: ${force}, alter: ${!force}`);
}

db.syncDatabase = syncDatabase;

/**
 * PUBLIC_INTERFACE
 * Returns the initialized db object (sequelize instance and models).
 */
function getDb() {
  return db;
}

module.exports = getDb;

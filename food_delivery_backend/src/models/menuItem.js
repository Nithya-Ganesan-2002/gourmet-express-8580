'use strict';
/**
 * MenuItem model: items offered by a restaurant.
 */
module.exports = (sequelize, DataTypes) => {
  const MenuItem = sequelize.define(
    'MenuItem',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      restaurant_id: { type: DataTypes.BIGINT, allowNull: false },
      name: { type: DataTypes.STRING(255), allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      is_available: { type: DataTypes.Boolean || DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      image_url: { type: DataTypes.STRING(512), allowNull: true },
      category: { type: DataTypes.STRING(128), allowNull: true },
    },
    {
      tableName: 'menu_items',
      indexes: [{ fields: ['restaurant_id'] }, { fields: ['name'] }, { fields: ['category'] }],
    }
  );
  return MenuItem;
};

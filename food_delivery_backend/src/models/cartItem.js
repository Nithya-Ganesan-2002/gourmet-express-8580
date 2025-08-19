'use strict';
/**
 * CartItem model: items added to a cart.
 */
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define(
    'CartItem',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      cart_id: { type: DataTypes.BIGINT, allowNull: false },
      menu_item_id: { type: DataTypes.BIGINT, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
      unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      special_instructions: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: 'cart_items',
      indexes: [{ fields: ['cart_id'] }, { fields: ['menu_item_id'] }],
    }
  );
  return CartItem;
};

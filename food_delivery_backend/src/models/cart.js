'use strict';
/**
 * Cart model: one active cart per user.
 */
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT, allowNull: false, unique: true },
      restaurant_id: { type: DataTypes.BIGINT, allowNull: true }, // Locked to a single restaurant per cart
    },
    {
      tableName: 'carts',
      indexes: [{ unique: true, fields: ['user_id'] }],
    }
  );
  return Cart;
};

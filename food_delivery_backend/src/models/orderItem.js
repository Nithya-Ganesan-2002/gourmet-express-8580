'use strict';
/**
 * OrderItem model: line items within an order.
 */
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define(
    'OrderItem',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      order_id: { type: DataTypes.BIGINT, allowNull: false },
      menu_item_id: { type: DataTypes.BIGINT, allowNull: false },
      quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
      unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      special_instructions: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: 'order_items',
      indexes: [{ fields: ['order_id'] }, { fields: ['menu_item_id'] }],
    }
  );
  return OrderItem;
};

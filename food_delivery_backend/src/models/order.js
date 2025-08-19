'use strict';
/**
 * Order model: belongs to a user and restaurant.
 * status: pending, confirmed, preparing, out_for_delivery, delivered, cancelled
 * payment_status: pending, paid, refunded, failed
 */
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      restaurant_id: { type: DataTypes.BIGINT, allowNull: false },
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        allowNull: false,
        defaultValue: 'pending',
      },
      payment_status: {
        type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      subtotal_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      tax_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      delivery_fee: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      delivery_address: { type: DataTypes.STRING(512), allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      placed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'orders',
      indexes: [{ fields: ['user_id'] }, { fields: ['restaurant_id'] }, { fields: ['status'] }, { fields: ['placed_at'] }],
    }
  );
  return Order;
};

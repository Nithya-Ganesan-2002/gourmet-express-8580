'use strict';
/**
 * OrderHistory model: audit trail of status changes and actions for an order.
 */
module.exports = (sequelize, DataTypes) => {
  const OrderHistory = sequelize.define(
    'OrderHistory',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      order_id: { type: DataTypes.BIGINT, allowNull: false },
      previous_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        allowNull: true,
      },
      new_status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'),
        allowNull: true,
      },
      actor_user_id: { type: DataTypes.BIGINT, allowNull: true }, // User who made the change (customer/admin), can be null for system actions
      notes: { type: DataTypes.TEXT, allowNull: true },
      changed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    {
      tableName: 'order_history',
      indexes: [{ fields: ['order_id'] }, { fields: ['changed_at'] }],
    }
  );
  return OrderHistory;
};

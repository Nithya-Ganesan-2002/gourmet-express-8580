'use strict';
/**
 * User model: represents application users (customers, admins).
 * Password is stored as a hash. Role can be 'customer' or 'admin' (extensible).
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      email: { type: DataTypes.STRING(255), allowNull: false, unique: true, validate: { isEmail: true } },
      password_hash: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.ENUM('customer', 'admin'), allowNull: false, defaultValue: 'customer' },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      last_login_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'users',
      indexes: [{ unique: true, fields: ['email'] }, { fields: ['role'] }],
    }
  );
  return User;
};

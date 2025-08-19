'use strict';
/**
 * UserProfile model: additional details for a user.
 */
module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define(
    'UserProfile',
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.BIGINT, allowNull: false },
      full_name: { type: DataTypes.STRING(255), allowNull: true },
      phone: { type: DataTypes.STRING(32), allowNull: true },
      address_line1: { type: DataTypes.STRING(255), allowNull: true },
      address_line2: { type: DataTypes.STRING(255), allowNull: true },
      city: { type: DataTypes.STRING(128), allowNull: true },
      state: { type: DataTypes.STRING(128), allowNull: true },
      postal_code: { type: DataTypes.STRING(24), allowNull: true },
      country: { type: DataTypes.STRING(64), allowNull: true },
      avatar_url: { type: DataTypes.STRING(512), allowNull: true },
    },
    {
      tableName: 'user_profiles',
      indexes: [{ fields: ['user_id'] }, { fields: ['phone'] }],
    }
  );
  return UserProfile;
};

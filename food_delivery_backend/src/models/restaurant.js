'use strict';
/**
 * Restaurant model.
 */
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define(
    'Restaurant',
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cuisine_type: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: true,
        validate: { min: 0, max: 5 },
      },
      is_open: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      image_url: {
        type: DataTypes.STRING(512),
        allowNull: true,
      },
    },
    {
      tableName: 'restaurants',
      indexes: [
        { fields: ['name'] },
        { fields: ['cuisine_type'] },
        { fields: ['city'] },
      ],
    }
  );
  return Restaurant;
};

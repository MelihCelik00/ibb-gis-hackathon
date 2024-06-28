'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ratings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ratings.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    userId: DataTypes.INTEGER,
    placeId: DataTypes.INTEGER,
    point: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Ratings',
  });
  return Ratings;
};
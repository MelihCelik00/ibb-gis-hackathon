'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Distances extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Distances.init({
    geom: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
      unique: false
    },
    fid: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    inputId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    targetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false
    },
    distance: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      unique: false
    }
  }, {
    sequelize,
    modelName: 'Distances',
    timestamps: false,
    paranoid: false
  });
  return Distances;
};
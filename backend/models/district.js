'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class District extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  District.init({
    geom: {
      type: DataTypes.GEOMETRY,
      allowNull: false,
      unique: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
    xcoord: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      unique: false
    },
    ycoord: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      unique: false
    }
  }, {
    sequelize,
    modelName: 'District',
    timestamps: false,
    paranoid: false
  });
  return District;
};
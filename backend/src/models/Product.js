const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subCategory: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  originalPrice: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  reviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isBestSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Product;

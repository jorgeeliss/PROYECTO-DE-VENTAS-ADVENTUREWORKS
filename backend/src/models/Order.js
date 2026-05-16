const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerLastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingState: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingZip: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingCountry: {
    type: DataTypes.STRING,
    allowNull: false
  },
  shippingMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  taxes: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  shippingCost: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Pending'
  }
});

module.exports = Order;

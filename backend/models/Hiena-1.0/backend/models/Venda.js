const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Venda = sequelize.define('Venda', {
  data: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  valorTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  itens: {
    type: DataTypes.JSON, // lista de produtos e quantidades
    allowNull: false
  }
});

module.exports = Venda;

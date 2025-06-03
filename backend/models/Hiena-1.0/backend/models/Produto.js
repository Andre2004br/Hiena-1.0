const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  nome: { type: DataTypes.STRING, allowNull: false },
  quantidade: { type: DataTypes.INTEGER, defaultValue: 0 },
  preco: { type: DataTypes.FLOAT, allowNull: false },
  estoqueMinimo: { type: DataTypes.INTEGER, defaultValue: 10 }, // Novo campo para estoque mínimo
  vencimento: { type: DataTypes.DATE } // Novo campo para vencimento do produto
});

module.exports = Produto;

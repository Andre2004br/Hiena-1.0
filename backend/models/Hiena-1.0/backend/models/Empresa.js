const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  nome: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Empresa;

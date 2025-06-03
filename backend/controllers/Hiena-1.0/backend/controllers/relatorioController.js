const Venda = require('../models/Venda');
const Produto = require('../models/Produto');
const { Op } = require('sequelize');

exports.relatorioDiario = async (req, res) => {
  const { data } = req.query;

  const vendas = await Venda.findAll({
    where: {
      data: {
        [Op.between]: [`${data} 00:00:00`, `${data} 23:59:59`]
      }
    }
  });

  res.json(vendas);
};

exports.relatorioMensal = async (req, res) => {
  const { data } = req.query;
  const [ano, mes] = data.split('-');

  const vendas = await Venda.findAll({
    where: {
      data: {
        [Op.between]: [`${ano}-${mes}-01`, `${ano}-${mes}-31`]
      }
    }
  });

  res.json(vendas);
};

exports.relatorioProduto = async (req, res) => {
  const { produto } = req.query;

  const vendas = await Venda.findAll({
    where: {
      produto: {
        [Op.like]: `%${produto}%`
      }
    }
  });

  res.json(vendas);
};


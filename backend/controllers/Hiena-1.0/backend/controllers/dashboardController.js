const Venda = require('../models/Venda');
const Produto = require('../models/Produto');
const { Op } = require('sequelize');

exports.getDashboard = async (req, res) => {
  const hoje = new Date().toISOString().split('T')[0];

  const vendasHoje = await Venda.findAll({
    where: {
      data: {
        [Op.between]: [`${hoje} 00:00:00`, `${hoje} 23:59:59`]
      }
    }
  });

  const produtos = await Produto.findAll();

  // Total de vendas por hora
  const vendasPorHora = Array(24).fill(0);
  vendasHoje.forEach(venda => {
    const hora = new Date(venda.data).getHours();
    vendasPorHora[hora]++;
  });

  // Produtos mais vendidos
  const vendidos = {};
  vendasHoje.forEach(venda => {
    if (!vendidos[venda.produto]) vendidos[venda.produto] = 0;
    vendidos[venda.produto] += venda.quantidade;
  });

  const maisVendidos = Object.entries(vendidos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  res.json({
    vendasPorHora,
    maisVendidos,
    estoque: produtos.map(p => ({ nome: p.nome, quantidade: p.quantidade }))
  });
};


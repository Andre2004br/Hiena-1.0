const Produto = require('../models/Produto');

exports.alertasEstoque = async (req, res) => {
  const produtos = await Produto.findAll({
    where: { quantidade: { [Sequelize.Op.lte]: Sequelize.col('estoqueMinimo') } }
  });

  res.json(produtos); // Retorna os produtos com estoque baixo
};

exports.alertasVencimento = async (req, res) => {
  const hoje = new Date();
  const produtos = await Produto.findAll({
    where: { vencimento: { [Sequelize.Op.lte]: hoje } }
  });

  res.json(produtos); // Retorna os produtos vencidos ou próximos do vencimento
};

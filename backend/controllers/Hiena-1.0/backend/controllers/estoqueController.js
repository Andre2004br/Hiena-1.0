const Produto = require('../models/Produto');

// Ver todos os produtos
exports.listarEstoque = async (req, res) => {
  try {
    const produtos = await Produto.findAll();
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Entrada manual
exports.entradaEstoque = async (req, res) => {
  const { id, quantidade } = req.body;
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    produto.quantidade += quantidade;
    await produto.save();

    res.json({ message: 'Entrada realizada', produto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Saída manual
exports.saidaEstoque = async (req, res) => {
  const { id, quantidade } = req.body;
  try {
    const produto = await Produto.findByPk(id);
    if (!produto) return res.status(404).json({ error: 'Produto não encontrado' });

    if (produto.quantidade < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    produto.quantidade -= quantidade;
    await produto.save();

    res.json({ message: 'Saída realizada', produto });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

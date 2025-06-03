const Produto = require('../models/Produto');
const Venda = require('../models/Venda');

exports.realizarVenda = async (req, res) => {
  const { itens } = req.body;
  let valorTotal = 0;

  try {
    for (const item of itens) {
      const produto = await Produto.findByPk(item.id);
      if (!produto || produto.quantidade < item.quantidade) {
        return res.status(400).json({ error: `Produto inválido ou sem estoque: ${item.nome}` });
      }
      produto.quantidade -= item.quantidade;
      valorTotal += item.quantidade * produto.preco;
      await produto.save();
    }

    const novaVenda = await Venda.create({
      itens,
      valorTotal
    });

    res.status(201).json({ message: 'Venda realizada com sucesso!', venda: novaVenda });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarVendas = async (req, res) => {
  try {
    const vendas = await Venda.findAll();
    res.json(vendas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

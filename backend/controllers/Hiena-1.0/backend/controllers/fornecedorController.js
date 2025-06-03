const Fornecedor = require('../models/Fornecedor');

exports.listar = async (req, res) => {
  const dados = await Fornecedor.findAll();
  res.json(dados);
};

exports.criar = async (req, res) => {
  const novo = await Fornecedor.create(req.body);
  res.json(novo);
};

exports.atualizar = async (req, res) => {
  const { id } = req.params;
  await Fornecedor.update(req.body, { where: { id } });
  res.json({ msg: 'Atualizado' });
};

exports.excluir = async (req, res) => {
  const { id } = req.params;
  await Fornecedor.destroy({ where: { id } });
  res.json({ msg: 'Removido' });
};


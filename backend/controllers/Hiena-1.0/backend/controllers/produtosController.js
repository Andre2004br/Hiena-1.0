const model = require('../../../../models/Hiena-1.0/backend/models/produtosModel');

module.exports = {
  listar: (req, res) => {
    model.listar((err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    });
  },

  inserir: (req, res) => {
    model.inserir(req.body, (err) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json({ mensagem: "Produto cadastrado com sucesso!" });
    });
  }
};

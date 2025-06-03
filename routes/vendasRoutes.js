app.post('/api/vendas', (req, res) => {
    const { produtoId, quantidade } = req.body;
    
    // Atualiza a quantidade no estoque
    db.run("UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?", [quantidade, produtoId], (err) => {
      if (err) return res.status(500).json({ mensagem: 'Erro ao registrar a venda' });
      res.json({ mensagem: 'Venda registrada com sucesso!' });
    });
  });
  
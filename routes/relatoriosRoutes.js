// relatorio diario

app.get('/api/relatorio/diario', (req, res) => {
    const dataHoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    db.all(`SELECT * FROM produtos WHERE DATE(data_venda) = ?`, [dataHoje], (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    });
  });
  
// relatorio mensal 

app.get('/api/relatorio/mensal', (req, res) => {
    const dataMes = new Date().toISOString().split('T')[0].slice(0, 7); // YYYY-MM
    db.all(`SELECT * FROM produtos WHERE strftime('%Y-%m', data_venda) = ?`, [dataMes], (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    });
  });

//relatorio por produto

app.get('/api/relatorio/produto', (req, res) => {
    const { produtoId } = req.query; // Passar produtoId como parâmetro
    db.all(`SELECT * FROM vendas WHERE produto_id = ?`, [produtoId], (err, rows) => {
      if (err) return res.status(500).json({ erro: err.message });
      res.json(rows);
    });
  });
  
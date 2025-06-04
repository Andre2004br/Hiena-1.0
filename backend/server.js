const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const xml2js = require('xml2js');
const fs = require('fs');
const { Op } = require('sequelize');
const moment = require('moment');
const sqlite3 = require('sqlite3').verbose();

// Models e Controllers
const sequelize = require('./config/db');
const Venda = require('./models/venda');
const Produto = require('./models/produto');
const produtosController = require('./controllers/Hiena-1.0/backend/controllers/produtosController');
const model = require('./models/produtosModel');

// Rotas
const alertaRoutes = require('./routes/alertas');
const fornecedorRoutes = require('./routes/fornecedor');
const dashboardRoutes = require('./routes/dashboard');
const relatorioRoutes = require('./routes/relatorio');
const nfeRoutes = require('./routes/nfe');
const vendaRoutes = require('./routes/venda');
const estoqueRoutes = require('./routes/estoque');
const authRoutes = require('./routes/auth');
const vendasRoutes = require('./routes/vendasRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');

const app = express();
const upload = multer({ dest: 'uploads/' });
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Rotas principais
app.use('/api/alertas', alertaRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/nfe', nfeRoutes);
app.use('/api/vendas', vendaRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/venda', vendasRoutes);
app.use('/api/relatorio', relatoriosRoutes);

// Rotas de produtos
app.get('/api/produtos', produtosController.listar);
app.post('/api/produtos', produtosController.inserir);

// Rota para importar XML de produtos
app.post('/api/importarXML', upload.single('xml'), (req, res) => {
  const parser = new xml2js.Parser();
  fs.readFile(req.file.path, (err, data) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao ler o XML' });

    parser.parseString(data, async (err, result) => {
      if (err) return res.status(500).json({ mensagem: 'Erro ao processar XML' });

      const produtos = result.nfeProc.NFe[0].infNFe[0].det.map(item => ({
        nome: item.prod[0].xProd[0],
        categoria: 'Categoria Exemplo',
        preco: parseFloat(item.prod[0].vProd[0]),
        quantidade: parseInt(item.prod[0].qCom[0]),
      }));

      for (const produto of produtos) {
        await model.inserir(produto, (err) => {
          if (err) console.error('Erro ao inserir produto:', err.message);
        });
      }

      res.json({ mensagem: 'XML importado com sucesso!' });
    });
  });
});

// Relatórios
app.get('/api/relatorio/diario', async (req, res) => {
  try {
    const vendasDiarias = await Venda.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf('day').toDate(),
          [Op.lte]: moment().endOf('day').toDate(),
        }
      }
    });
    res.json(vendasDiarias);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório diário' });
  }
});

app.get('/api/relatorio/mensal', async (req, res) => {
  try {
    const vendasMensais = await Venda.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf('month').toDate(),
          [Op.lte]: moment().endOf('month').toDate(),
        }
      }
    });
    res.json(vendasMensais);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório mensal' });
  }
});

app.get('/api/relatorio/produto/:produtoId', async (req, res) => {
  const produtoId = req.params.produtoId;
  try {
    const vendasPorProduto = await Venda.findAll({
      where: { produtoId },
    });
    res.json(vendasPorProduto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório por produto' });
  }
});

// Registrar venda
app.post('/api/venda', async (req, res) => {
  const { produtoId, quantidade, valor } = req.body;
  try {
    const produto = await Produto.findByPk(produtoId);
    if (!produto) return res.status(400).json({ error: 'Produto não encontrado' });
    if (produto.estoque < quantidade) return res.status(400).json({ error: 'Estoque insuficiente' });

    const venda = await Venda.create({
      produtoId,
      quantidade,
      valor,
      total: quantidade * valor
    });

    produto.estoque -= quantidade;
    await produto.save();

    res.json(venda);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
});

// Banco de dados SQLite para empresas (login)
const db = new sqlite3.Database('./backend/database.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS empresas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  senha TEXT NOT NULL
)`);

app.post('/api/login', (req, res) => {
  const { empresa, senha } = req.body;
  db.get("SELECT * FROM empresas WHERE nome = ? AND senha = ?", [empresa, senha], (err, row) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    if (!row) return res.status(401).json({ message: "Empresa ou senha inválida" });
    res.json({ empresaId: row.id });
  });
});

// Inicialização do servidor
sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
});

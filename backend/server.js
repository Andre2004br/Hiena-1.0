const alertaRoutes = require('./routes/alertas');
app.use('/api/alertas', alertaRoutes);


//

const fornecedorRoutes = require('./routes/fornecedor');
app.use('/api/fornecedores', fornecedorRoutes);


//

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);


//

const relatorioRoutes = require('./routes/relatorio');
app.use('/api/relatorios', relatorioRoutes);

//

const nfeRoutes = require('./routes/nfe');
app.use('/api/nfe', nfeRoutes);

//

const vendaRoutes = require('./routes/venda');
app.use('/api/vendas', vendaRoutes);

//

const estoqueRoutes = require('./routes/estoque');
app.use('/api/estoque', estoqueRoutes);

//

const express = require('express');
const app = express();
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');

app.use(express.json());
app.use('/api/auth', authRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
});

//

npm install xml2js

npm install bcrypt jsonwebtoken
 
npm install multer xml2js
// entrada de XML



const xml2js = require('xml2js');  // Aqui estamos importando o xml2js
const fs = require('fs');           // Para ler o arquivo XML
const express = require('express');
const multer = require('multer');
const app = express();

const xml2js = require('xml2js');  // Importando o xml2js
const fs = require('fs');           // Para ler o arquivo XML
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });  // Diretório temporário para armazenar os arquivos

// Aqui vai o seu servidor Express
const app = express();
const port = 3000;

// Rota para processar a importação do XML
app.post('/api/importarXML', upload.single('xml'), (req, res) => {
  const parser = new xml2js.Parser(); // Criando uma instância do parser

  // Lê o arquivo XML enviado
  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      return res.status(500).json({ mensagem: 'Erro ao ler o XML' });
    }

    // Aqui processamos o XML
    parser.parseString(data, async (err, result) => {
      if (err) {
        return res.status(500).json({ mensagem: 'Erro ao processar o XML' });
      }

      // Exemplo de como acessar os dados extraídos do XML
      const produtos = result.nfeProc.NFe[0].infNFe[0].det.map(item => ({
        nome: item.prod[0].xProd[0],   // Nome do produto
        categoria: 'Categoria Exemplo', // Categoria (isso você pode personalizar)
        preco: parseFloat(item.prod[0].vProd[0]), // Preço
        quantidade: parseInt(item.prod[0].qCom[0])  // Quantidade
      }));

      // Agora, insere os produtos no banco de dados (você vai adaptar para seu banco)
      for (const produto of produtos) {
        // Aqui você insere no banco (exemplo com o modelo de produto)
        await model.inserir(produto, (err) => {
          if (err) console.error('Erro ao inserir produto:', err.message);
        });
      }

      // Respondendo ao cliente
      res.json({ mensagem: 'XML importado com sucesso!' });
    });
  });
});

// Inicializando o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./backend/database.sqlite');

app.use(cors());
app.use(bodyParser.json());

// Criação da tabela empresa
db.run(`CREATE TABLE IF NOT EXISTS empresas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  senha TEXT NOT NULL
)`);

// Rota de login
app.post('/api/login', (req, res) => {
  const { empresa, senha } = req.body;

  db.get("SELECT * FROM empresas WHERE nome = ? AND senha = ?", [empresa, senha], (err, row) => {
    if (err) return res.status(500).json({ message: "Erro no servidor" });
    if (!row) return res.status(401).json({ message: "Empresa ou senha inválida" });

    res.json({ empresaId: row.id });
  });
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
const produtosController = require('./controllers/Hiena-1.0/backend/controllers/produtosController');

app.get('/api/produtos', produtosController.listar);
app.post('/api/produtos', produtosController.inserir);
 
const express = require('express');
const multer = require('multer');
const xml2js = require('xml2js');
const fs = require('fs');
const model = require('./models/produtosModel');
const upload = multer({ dest: 'uploads/' });
const app = express();
const port = 3000;

// Middleware para JSON
app.use(express.json());

// Rota para importar o XML
app.post('/api/importarXML', upload.single('xml'), (req, res) => {
  const parser = new xml2js.Parser();
  fs.readFile(req.file.path, (err, data) => {
    if (err) return res.status(500).json({ mensagem: 'Erro ao ler o XML' });

    parser.parseString(data, async (err, result) => {
      if (err) return res.status(500).json({ mensagem: 'Erro ao processar XML' });

      // Aqui vamos processar o XML (exemplo de como pegar as informações)
      const produtos = result.nfeProc.NFe[0].infNFe[0].det.map(item => ({
        nome: item.prod[0].xProd[0],
        categoria: 'Categoria Exemplo', // Isso você pode adaptar conforme o XML
        preco: parseFloat(item.prod[0].vProd[0]),
        quantidade: parseInt(item.prod[0].qCom[0]),
      }));

      // Atualiza o estoque
      for (const produto of produtos) {
        await model.inserir(produto, (err) => {
          if (err) console.error('Erro ao inserir produto:', err.message);
        });
      }

      res.json({ mensagem: 'XML importado com sucesso!' });
    });
  });
});

// Inicializando servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});



const express = require('express');
const app = express();
const { Op } = require('sequelize'); // Para usar os operadores do Sequelize, caso esteja usando esse ORM
const moment = require('moment'); // Para manipulação de datas
const Venda = require('./models/venda'); // Supondo que você tem um modelo de venda no Sequelize

// Rota para Relatório Diário
app.get('/api/relatorio/diario', async (req, res) => {
  try {
    const vendasDiarias = await Venda.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf('day').toDate(), // Pega todas as vendas do dia
          [Op.lte]: moment().endOf('day').toDate(),   // Pega todas as vendas até o final do dia
        }
      }
    });
    
    res.json(vendasDiarias); // Retorna as vendas do dia
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório diário' });
  }
});

// Rota para Relatório Mensal
app.get('/api/relatorio/mensal', async (req, res) => {
  try {
    const vendasMensais = await Venda.findAll({
      where: {
        createdAt: {
          [Op.gte]: moment().startOf('month').toDate(), // Pega todas as vendas do mês
          [Op.lte]: moment().endOf('month').toDate(),   // Pega todas as vendas até o final do mês
        }
      }
    });
    
    res.json(vendasMensais); // Retorna as vendas do mês
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório mensal' });
  }
});

// Rota para Relatório por Produto
app.get('/api/relatorio/produto/:produtoId', async (req, res) => {
  const produtoId = req.params.produtoId;
  
  try {
    const vendasPorProduto = await Venda.findAll({
      where: { produtoId },
    });
    
    res.json(vendasPorProduto); // Retorna as vendas para um produto específico
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar relatório por produto' });
  }
});

const Produto = require('./models/produto'); // Modelo de Produto

// Rota para registrar uma venda
app.post('/api/venda', async (req, res) => {
  const { produtoId, quantidade, valor } = req.body; // Dados da venda

  try {
    // Verifica se o produto existe e se há estoque suficiente
    const produto = await Produto.findByPk(produtoId);
    
    if (!produto) {
      return res.status(400).json({ error: 'Produto não encontrado' });
    }
    
    if (produto.estoque < quantidade) {
      return res.status(400).json({ error: 'Estoque insuficiente' });
    }

    // Cria a venda
    const venda = await Venda.create({
      produtoId,
      quantidade,
      valor,
      total: quantidade * valor
    });

    // Atualiza o estoque
    produto.estoque -= quantidade;
    await produto.save();

    res.json(venda); // Retorna os dados da venda criada
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar venda' });
  }
});

const vendasRoutes = require('./routes/vendasRoutes');
const relatoriosRoutes = require('./routes/relatoriosRoutes');

app.use('/api/venda', vendasRoutes);
app.use('/api/relatorio', relatoriosRoutes);

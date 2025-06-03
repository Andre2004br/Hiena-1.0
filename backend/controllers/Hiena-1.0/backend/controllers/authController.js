const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'hiena1.0_secret'; // Troque por uma ENV depois

exports.cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ nome, email, senha: senhaHash });

    res.status(201).json({ message: 'Usuário criado com sucesso', usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario.id }, JWT_SECRET, { expiresIn: '1d' });

    res.json({ message: 'Login efetuado com sucesso', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  const usuario = await Usuario.findOne({ where: { email }, include: 'Empresa' });
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

  const valido = await bcrypt.compare(senha, usuario.senha);
  if (!valido) return res.status(401).json({ erro: 'Senha incorreta' });

  const token = jwt.sign({ id: usuario.id, empresaId: usuario.EmpresaId }, 'segredo123', { expiresIn: '1h' });
  res.json({ token, usuario: { nome: usuario.nome, empresaId: usuario.EmpresaId } });
};

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'hiena1.0_secret';

function verificarToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuarioId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = verificarToken;


const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token ausente' });

  try {
    const decoded = jwt.verify(token, 'segredo123');
    req.usuario = decoded;
    next();
  } catch (e) {
    res.status(401).json({ erro: 'Token inválido' });
  }
};

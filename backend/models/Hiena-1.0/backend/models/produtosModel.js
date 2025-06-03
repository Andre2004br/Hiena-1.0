const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./backend/database.sqlite');

db.run(`CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT,
  categoria TEXT,
  preco REAL,
  quantidade INTEGER
)`);

module.exports = {
  listar: (callback) => {
    db.all("SELECT * FROM produtos", [], callback);
  },
  inserir: (produto, callback) => {
    const { nome, categoria, preco, quantidade } = produto;
    db.run("INSERT INTO produtos (nome, categoria, preco, quantidade) VALUES (?, ?, ?, ?)",
      [nome, categoria, preco, quantidade],
      callback
    );
  }
};

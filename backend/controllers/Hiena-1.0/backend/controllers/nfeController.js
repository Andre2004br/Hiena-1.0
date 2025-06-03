const fs = require('fs');
const xml2js = require('xml2js');
const Produto = require('../models/Produto');

exports.importarXML = async (req, res) => {
  const xmlPath = req.file.path;

  try {
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    const result = await xml2js.parseStringPromise(xmlContent);

    const produtosXML = result.nfeProc?.NFe?.[0]?.infNFe?.[0]?.det || [];

    for (let item of produtosXML) {
      const prod = item.prod[0];
      const nome = prod.xProd[0];
      const preco = parseFloat(prod.vUnCom[0]);
      const quantidade = parseInt(prod.qCom[0]);

      // Verifica se já existe o produto
      let produto = await Produto.findOne({ where: { nome } });
      if (produto) {
        produto.quantidade += quantidade;
        produto.preco = preco; // opcional: atualiza preço
        await produto.save();
      } else {
        await Produto.create({ nome, preco, quantidade });
      }
    }

    res.json({ message: 'Nota fiscal importada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao processar o XML' });
  } finally {
    fs.unlinkSync(xmlPath); // Remove o arquivo após processar
  }
};

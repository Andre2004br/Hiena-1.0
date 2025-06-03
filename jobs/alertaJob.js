const cron = require('node-cron');
const { alertasEstoque, alertasVencimento } = require('../controllers/alertaController');

// Job para verificar estoque baixo
cron.schedule('0 9 * * *', async () => { // 9 AM todos os dias
  const produtosEstoqueBaixo = await alertasEstoque();
  if (produtosEstoqueBaixo.length > 0) {
    console.log('Alertas de estoque baixo:', produtosEstoqueBaixo);
    // Aqui você pode enviar um e-mail ou mensagem de alerta
  }
});

// Job para verificar produtos vencidos
cron.schedule('0 9 * * *', async () => { // 9 AM todos os dias
  const produtosVencidos = await alertasVencimento();
  if (produtosVencidos.length > 0) {
    console.log('Alertas de produtos vencidos:', produtosVencidos);
    // Aqui você pode enviar um e-mail ou mensagem de alerta
  }
});

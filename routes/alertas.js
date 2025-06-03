const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');

router.get('/estoque-baixo', alertaController.alertasEstoque);
router.get('/vencimento', alertaController.alertasVencimento);

module.exports = router;

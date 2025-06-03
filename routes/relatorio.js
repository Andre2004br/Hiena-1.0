const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const relatorioController = require('../controllers/relatorioController');

router.get('/diario', auth, relatorioController.relatorioDiario);
router.get('/mensal', auth, relatorioController.relatorioMensal);
router.get('/produto', auth, relatorioController.relatorioProduto);

module.exports = router;


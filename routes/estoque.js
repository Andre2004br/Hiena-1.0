const express = require('express');
const router = express.Router();
const estoqueController = require('../controllers/estoqueController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, estoqueController.listarEstoque);
router.post('/entrada', auth, estoqueController.entradaEstoque);
router.post('/saida', auth, estoqueController.saidaEstoque);

module.exports = router;

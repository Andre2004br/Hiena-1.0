const express = require('express');
const router = express.Router();
const vendaController = require('../controllers/vendaController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, vendaController.realizarVenda);
router.get('/', auth, vendaController.listarVendas);

module.exports = router;


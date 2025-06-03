const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const nfeController = require('../controllers/nfeController');

const upload = multer({ dest: path.join(__dirname, '../uploads/') });

router.post('/importar', auth, upload.single('xml'), nfeController.importarXML);

module.exports = router;

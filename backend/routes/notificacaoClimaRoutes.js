const express = require('express');
const router = express.Router();
const notificacaoClimaController = require('../controllers/notificacaoClimaController');

router.get('/', notificacaoClimaController.getNotificacoesClima);

module.exports = router;

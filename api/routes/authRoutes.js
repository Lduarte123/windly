const express = require('express');
const router = express.Router();
const { loginStepOne, verify2FA } = require('../controllers/authController');

// Rota para etapa 1: usuário envia email e senha
router.post('/login', loginStepOne);

// Rota para etapa 2: usuário envia código 2FA
router.post('/verify-2fa', verify2FA);

module.exports = router;

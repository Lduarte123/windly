const express = require('express');
const router = express.Router();
const { loginStepOne, verify2FA } = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticação de usuários (login e 2FA)
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia o login do usuário (envia código 2FA por e-mail)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Código 2FA enviado por e-mail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Código 2FA enviado por e-mail
 *       401:
 *         description: Credenciais inválidas
 */

/**
 * @swagger
 * /api/auth/verify-2fa:
 *   post:
 *     summary: Verifica o código 2FA e retorna o token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login autorizado
 *                 token:
 *                   type: string
 *                   example: JWT_TOKEN_AQUI
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Código inválido ou expirado
 */

router.post('/login', loginStepOne);
router.post('/verify-2fa', verify2FA);

module.exports = router;

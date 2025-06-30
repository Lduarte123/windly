const express = require('express');
const router = express.Router();
const controller = require('../api_src/controllers/userConfigController');

/**
 * @swagger
 * tags:
 *   name: UserConfig
 *   description: Configurações do usuário (preferências de unidade e notificações)
 */

/**
 * @swagger
 * /api/user-config/{usuario_id}:
 *   get:
 *     summary: Retorna as configurações do usuário
 *     tags: [UserConfig]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configurações do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserConfig'
 *       404:
 *         description: Configuração não encontrada
 *
 *   put:
 *     summary: Atualiza as configurações do usuário
 *     tags: [UserConfig]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserConfig'
 *     responses:
 *       200:
 *         description: Configuração atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserConfig'
 *       404:
 *         description: Configuração não encontrada
 */

router.get('/:usuario_id', controller.getConfig);
router.put('/:usuario_id', controller.updateConfig);

module.exports = router;
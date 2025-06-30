const express = require('express');
const controller = require('../api_src/controllers/cidadeFavoritaController');
const {
  validateUsuarioIdInQuery,
  validateUsuarioIdInBody,
  validateNomeAndUsuarioIdInBody,
} = require('../api_src/middleware/cidadeMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CidadeFavorita
 *   description: Gerenciamento de cidades favoritas
 */

/**
 * @swagger
 * /api/cidades-favoritas:
 *   post:
 *     summary: Adiciona uma nova cidade favorita
 *     tags: [CidadeFavorita]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - usuario_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: São Paulo
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cidade favorita criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CidadeFavorita'
 *
 * /api/cidades-favoritas/{id}:
 *   get:
 *     summary: Busca uma cidade favorita por ID e usuário
 *     tags: [CidadeFavorita]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade favorita
 *       - in: query
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Cidade favorita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CidadeFavorita'
 *       404:
 *         description: Cidade favorita não encontrada
 *   put:
 *     summary: Atualiza uma cidade favorita
 *     tags: [CidadeFavorita]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade favorita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - usuario_id
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Rio de Janeiro
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cidade favorita atualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CidadeFavorita'
 *       404:
 *         description: Cidade favorita não encontrada
 *   delete:
 *     summary: Remove uma cidade favorita
 *     tags: [CidadeFavorita]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade favorita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cidade favorita removida
 *       404:
 *         description: Cidade favorita não encontrada
 *
 * /api/cidades-favoritas/usuario/{usuario_id}:
 *   get:
 *     summary: Lista todas as cidades favoritas de um usuário
 *     tags: [CidadeFavorita]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de cidades favoritas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CidadeFavorita'
 */

router.get('/usuario/:usuario_id', controller.getAllByUser);
router.get('/:id', validateUsuarioIdInQuery, controller.getById);
router.put('/:id', validateNomeAndUsuarioIdInBody, controller.update);
router.delete('/:id', validateUsuarioIdInBody, controller.remove);
router.post('/', validateNomeAndUsuarioIdInBody, controller.create);

module.exports = router;
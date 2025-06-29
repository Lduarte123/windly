const express = require('express');
const controller = require('../controllers/cidadeFavoritaController');

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
 *   get:
 *     summary: Lista todas as cidades favoritas
 *     tags: [CidadeFavorita]
 *     responses:
 *       200:
 *         description: Lista de cidades favoritas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CidadeFavorita'
 *
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
 *             properties:
 *               nome:
 *                 type: string
 *                 example: São Paulo
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
 *     summary: Busca uma cidade favorita por ID
 *     tags: [CidadeFavorita]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da cidade favorita
 *     responses:
 *       200:
 *         description: Cidade favorita encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CidadeFavorita'
 *       404:
 *         description: Cidade favorita não encontrada
 *
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
 *     responses:
 *       200:
 *         description: Cidade favorita removida
 *       404:
 *         description: Cidade favorita não encontrada
 */

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);
router.get('/usuario/:usuario_id', controller.getAllByUser);

module.exports = router;
const express = require('express');
const controller = require('../api/controllers/lembreteController');
const authenticateToken = require('../api/middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Lembretes
 *   description: CRUD de lembretes por usuário
 */

/**
 * @swagger
 * /api/lembretes/usuario/{usuario_id}:
 *   get:
 *     summary: Lista todos os lembretes de um usuário
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de lembretes
 *       500:
 *         description: Erro ao buscar lembretes
 *
 * /api/lembretes/{id}:
 *   get:
 *     summary: Busca um lembrete por ID
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do lembrete
 *     responses:
 *       200:
 *         description: Lembrete encontrado
 *       404:
 *         description: Lembrete não encontrado
 *
 *   put:
 *     summary: Atualiza um lembrete
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do lembrete
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lembrete atualizado
 *       404:
 *         description: Lembrete não encontrado
 *
 *   delete:
 *     summary: Remove um lembrete
 *     tags: [Lembretes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do lembrete
 *     responses:
 *       200:
 *         description: Lembrete removido
 *       404:
 *         description: Lembrete não encontrado
 *
 * /api/lembretes:
 *   post:
 *     summary: Cria um novo lembrete
 *     tags: [Lembretes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - titulo
 *             properties:
 *               usuario_id:
 *                 type: integer
 *               titulo:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lembrete criado
 *       400:
 *         description: Dados inválidos
 */

class LembreteRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/usuario/:usuario_id', authenticateToken, controller.getAllByUser);
    this.router.get('/:id', controller.getById);
    this.router.post('/', controller.create);
    this.router.put('/:id', controller.update);
    this.router.delete('/:id', controller.remove);
  }

  getRouter() {
    return this.router;
  }
}

module.exports = new LembreteRoutes().getRouter();
const express = require('express');
const controller = require('../controllers/empresaController');
const ValidateEmpresa = require('../middleware/validateEmpresa');

class EmpresaRoutes {
  constructor() {
    this.router = express.Router();
    this.registerRoutes();
  }

 registerRoutes() {
  /**
   * @swagger
   * /empresas:
   *   get:
   *     summary: Retorna todas as empresas
   *     tags: [Empresas]
   *     responses:
   *       200:
   *         description: Lista de empresas
   */
  this.router.get('/', controller.getAll);

  /**
   * @swagger
   * /empresas/{id}:
   *   get:
   *     summary: Retorna uma empresa por ID
   *     tags: [Empresas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID da empresa
   *     responses:
   *       200:
   *         description: Empresa encontrada
   *       404:
   *         description: Empresa não encontrada
   */
  this.router.get('/:id', controller.getById);

  /**
   * @swagger
   * /empresas:
   *   post:
   *     summary: Cria uma nova empresa
   *     tags: [Empresas]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nome
   *               - ramo
   *               - logradouro
   *               - cidade
   *               - estado
   *             properties:
   *               nome:
   *                 type: string
   *               ramo:
   *                 type: string
   *               logradouro:
   *                 type: string
   *               cidade:
   *                 type: string
   *               estado:
   *                 type: string
   *     responses:
   *       201:
   *         description: Empresa criada com sucesso
   */
  this.router.post('/', ValidateEmpresa.validate, controller.create);

  /**
   * @swagger
   * /empresas/{id}:
   *   put:
   *     summary: Atualiza uma empresa existente
   *     tags: [Empresas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *               ramo:
   *                 type: string
   *               logradouro:
   *                 type: string
   *               cidade:
   *                 type: string
   *               estado:
   *                 type: string
   *     responses:
   *       200:
   *         description: Empresa atualizada
   *       404:
   *         description: Empresa não encontrada
   */
  this.router.put('/:id', ValidateEmpresa.validate, controller.update);

  /**
   * @swagger
   * /empresas/{id}:
   *   delete:
   *     summary: Remove uma empresa
   *     tags: [Empresas]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Empresa removida com sucesso
   */
  this.router.delete('/:id', controller.remove);
}

getRouter() {
  return this.router;
}
}

module.exports = new EmpresaRoutes().getRouter();

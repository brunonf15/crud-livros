// server.js
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Configurações do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Livros',
      version: '1.0.0',
      description: 'Uma API simples para gerenciar livros',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./server.js'], // Caminho para os arquivos que contêm as anotações do Swagger
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

let livros = [];
let idAtual = 1;

/**
 * @swagger
 * components:
 *   schemas:
 *     Livro:
 *       type: object
 *       required:
 *         - id
 *         - nome
 *         - autor
 *         - paginas
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do livro
 *         nome:
 *           type: string
 *           description: Nome do livro
 *         autor:
 *           type: string
 *           description: Autor do livro
 *         paginas:
 *           type: integer
 *           description: Número de páginas do livro
 *       example:
 *         id: 1
 *         nome: "O Alquimista"
 *         autor: "Paulo Coelho"
 *         paginas: 208
 */

/**
 * @swagger
 * tags:
 *   name: Livros
 *   description: API para gerenciamento de livros
 */

/**
 * @swagger
 * /livros:
 *   post:
 *     summary: Cria um novo livro
 *     tags: [Livros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - autor
 *               - paginas
 *             properties:
 *               nome:
 *                 type: string
 *               autor:
 *                 type: string
 *               paginas:
 *                 type: integer
 *             example:
 *               nome: "O Alquimista"
 *               autor: "Paulo Coelho"
 *               paginas: 208
 *     responses:
 *       201:
 *         description: Livro criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Todos os campos são obrigatórios"
 */
app.post('/livros', (req, res) => {
  const { nome, autor, paginas } = req.body;
  if (!nome || !autor || !paginas) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }
  const novoLivro = { id: idAtual++, nome, autor, paginas };
  livros.push(novoLivro);
  res.status(201).json(novoLivro);
});

/**
 * @swagger
 * /livros:
 *   get:
 *     summary: Lista todos os livros
 *     tags: [Livros]
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 */
app.get('/livros', (req, res) => {
  res.json(livros);
});

/**
 * @swagger
 * /livros/{id}:
 *   get:
 *     summary: Obter um livro pelo ID
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do livro
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do livro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Livro não encontrado"
 */
app.get('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const livro = livros.find((l) => l.id === id);
  if (livro) {
    res.json(livro);
  } else {
    res.status(404).json({ mensagem: 'Livro não encontrado' });
  }
});

/**
 * @swagger
 * /livros/{id}:
 *   put:
 *     summary: Atualiza um livro pelo ID
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do livro
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
 *               autor:
 *                 type: string
 *               paginas:
 *                 type: integer
 *             example:
 *               nome: "Novo Nome"
 *               autor: "Novo Autor"
 *               paginas: 300
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Livro não encontrado"
 */
app.put('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, autor, paginas } = req.body;
  const livro = livros.find((l) => l.id === id);
  if (livro) {
    livro.nome = nome || livro.nome;
    livro.autor = autor || livro.autor;
    livro.paginas = paginas || livro.paginas;
    res.json(livro);
  } else {
    res.status(404).json({ mensagem: 'Livro não encontrado' });
  }
});

/**
 * @swagger
 * /livros/{id}:
 *   delete:
 *     summary: Deleta um livro pelo ID
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do livro
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Livro deletado com sucesso
 *       404:
 *         description: Livro não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensagem:
 *                   type: string
 *                   example: "Livro não encontrado"
 */
app.delete('/livros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const indice = livros.findIndex((l) => l.id === id);
  if (indice !== -1) {
    livros.splice(indice, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ mensagem: 'Livro não encontrado' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
});

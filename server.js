// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const db = require('./db');
const { startCleanupJob } = require('./cleanup');

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
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
app.post('/livros', async (req, res) => {
  const { nome, autor, paginas } = req.body;
  if (!nome || !autor || !paginas) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }
  try {
    const [result] = await db.pool.query(
      'INSERT INTO livros (nome, autor, paginas) VALUES (?, ?, ?)',
      [nome, autor, Number(paginas)]
    );
    res.status(201).json({ id: result.insertId, nome, autor, paginas: Number(paginas) });
  } catch (err) {
    console.error('[POST /livros] erro:', err.message);
    res.status(500).json({ mensagem: 'Erro ao criar livro' });
  }
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
app.get('/livros', async (req, res) => {
  try {
    const [rows] = await db.pool.query('SELECT id, nome, autor, paginas FROM livros');
    res.json(rows);
  } catch (err) {
    console.error('[GET /livros] erro:', err.message);
    res.status(500).json({ mensagem: 'Erro ao listar livros' });
  }
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
app.get('/livros/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [rows] = await db.pool.query(
      'SELECT id, nome, autor, paginas FROM livros WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
  } catch (err) {
    console.error('[GET /livros/:id] erro:', err.message);
    res.status(500).json({ mensagem: 'Erro ao buscar livro' });
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
app.put('/livros/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, autor, paginas } = req.body;
  try {
    const [rows] = await db.pool.query(
      'SELECT id, nome, autor, paginas FROM livros WHERE id = ? LIMIT 1',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
    const atual = rows[0];
    const novo = {
      nome: nome || atual.nome,
      autor: autor || atual.autor,
      paginas: paginas != null ? Number(paginas) : atual.paginas,
    };
    await db.pool.query(
      'UPDATE livros SET nome = ?, autor = ?, paginas = ? WHERE id = ?',
      [novo.nome, novo.autor, novo.paginas, id]
    );
    res.json({ id, ...novo });
  } catch (err) {
    console.error('[PUT /livros/:id] erro:', err.message);
    res.status(500).json({ mensagem: 'Erro ao atualizar livro' });
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
app.delete('/livros/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const [result] = await db.pool.query('DELETE FROM livros WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ mensagem: 'Livro não encontrado' });
    }
  } catch (err) {
    console.error('[DELETE /livros/:id] erro:', err.message);
    res.status(500).json({ mensagem: 'Erro ao deletar livro' });
  }
});

async function bootstrap() {
  try {
    await db.init();
    startCleanupJob();
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
      console.log(`Documentação disponível em http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error('Falha ao iniciar o servidor:', err.message);
    process.exit(1);
  }
}

bootstrap();

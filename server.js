const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const PORT = 3001; // Porta diferente da API de livros

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Array para armazenar os carros (simula banco de dados)
let carros = [
  { id: 1, marca: 'Toyota', modelo: 'Corolla', ano: 2023, cor: 'Prata', preco: 25000 },
  { id: 2, marca: 'Honda', modelo: 'Civic', ano: 2022, cor: 'Preto', preco: 23000 }
];

let proximoId = 3;

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Carros',
      version: '1.0.0',
      description: 'API simples para gerenciar carros'
    },
    servers: [
      {
        url: `http://localhost:${PORT}`
      }
    ]
  },
  apis: ['./server.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * components:
 *   schemas:
 *     Carro:
 *       type: object
 *       required:
 *         - marca
 *         - modelo
 *         - ano
 *         - cor
 *         - preco
 *       properties:
 *         id:
 *           type: integer
 *           description: ID gerado automaticamente
 *         marca:
 *           type: string
 *           description: Marca do carro
 *         modelo:
 *           type: string
 *           description: Modelo do carro
 *         ano:
 *           type: integer
 *           description: Ano de fabricação
 *         cor:
 *           type: string
 *           description: Cor do carro
 *         preco:
 *           type: number
 *           description: Preço do carro
 */

/**
 * @swagger
 * /carros:
 *   get:
 *     summary: Retorna a lista de todos os carros
 *     responses:
 *       200:
 *         description: Lista de carros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Carro'
 */
app.get('/carros', (req, res) => {
  res.json(carros);
});

/**
 * @swagger
 * /carros/{id}:
 *   get:
 *     summary: Retorna um carro específico pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do carro
 *     responses:
 *       200:
 *         description: Dados do carro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Carro'
 *       404:
 *         description: Carro não encontrado
 */
app.get('/carros/:id', (req, res) => {
  const carro = carros.find(c => c.id === parseInt(req.params.id));
  if (!carro) {
    return res.status(404).json({ mensagem: 'Carro não encontrado' });
  }
  res.json(carro);
});

/**
 * @swagger
 * /carros:
 *   post:
 *     summary: Adiciona um novo carro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               ano:
 *                 type: integer
 *               cor:
 *                 type: string
 *               preco:
 *                 type: number
 *     responses:
 *       201:
 *         description: Carro criado com sucesso
 */
app.post('/carros', (req, res) => {
  const { marca, modelo, ano, cor, preco } = req.body;
  const novoCarro = {
    id: proximoId++,
    marca,
    modelo,
    ano: parseInt(ano),
    cor,
    preco: parseFloat(preco)
  };
  carros.push(novoCarro);
  res.status(201).json(novoCarro);
});

/**
 * @swagger
 * /carros/{id}:
 *   put:
 *     summary: Atualiza um carro existente
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
 *             $ref: '#/components/schemas/Carro'
 *     responses:
 *       200:
 *         description: Carro atualizado com sucesso
 *       404:
 *         description: Carro não encontrado
 */
app.put('/carros/:id', (req, res) => {
  const carro = carros.find(c => c.id === parseInt(req.params.id));
  if (!carro) {
    return res.status(404).json({ mensagem: 'Carro não encontrado' });
  }
  
  const { marca, modelo, ano, cor, preco } = req.body;
  carro.marca = marca;
  carro.modelo = modelo;
  carro.ano = parseInt(ano);
  carro.cor = cor;
  carro.preco = parseFloat(preco);
  
  res.json(carro);
});

/**
 * @swagger
 * /carros/{id}:
 *   delete:
 *     summary: Remove um carro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Carro removido com sucesso
 *       404:
 *         description: Carro não encontrado
 */
app.delete('/carros/:id', (req, res) => {
  const index = carros.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ mensagem: 'Carro não encontrado' });
  }
  
  carros.splice(index, 1);
  res.json({ mensagem: 'Carro removido com sucesso' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger: http://localhost:${PORT}/api-docs`);
});
